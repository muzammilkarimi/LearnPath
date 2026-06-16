import type { Lesson } from "@/lib/types"

const lesson: Lesson = {
  id: "sd-03-message-queues",
  tech: "system-design",
  pathId: "foundations",
  order: 3,
  title: "The Payment That Never Arrived",
  storyTitle: "Duplicate Charges & Silent Failures",
  storyContext: `Your app now has paying customers. And the support tickets are brutal.

📩 **Support ticket #891:** "I was charged twice for my subscription. Please refund."

📩 **Support ticket #904:** "I paid but my account still shows as free. It's been 3 hours."

📩 **Support ticket #912:** "The checkout page timed out. Am I charged? I don't know!"

You look at the checkout code. When a user pays, you:
1. Charge their card via Stripe API (400ms)
2. Send a confirmation email via SendGrid (300ms)
3. Create a subscription record in DB (50ms)
4. Post a Slack notification to #new-customers (200ms)
5. Update analytics via Segment (150ms)

Total: ~1,100ms. And all of this happens **synchronously** — step by step, blocking the response. If step 4 fails, the user's card was charged but they have no subscription. If the request times out after 30 seconds, you don't know which steps completed.

📩 **Alex:** "We need to fix this. People are getting duplicate charges."

📩 **You:** "The problem is we're doing everything in one synchronous request. We need to decouple this. Some of this stuff doesn't need to happen before we say 'thank you for your payment'."`,
  concept: "Message Queues & Async Processing",
  challenge: `Redesign the payment flow to be reliable and fault-tolerant using a message queue. The checkout must:
- Never charge a user without creating their subscription
- Never block the user waiting for emails/analytics (non-critical)
- Retry failed steps automatically
- Be idempotent (running twice = same result as running once)

Design the async architecture below.`,
  starterCode: `# Async Payment Architecture

## Current Problem (Synchronous Flow)
User click → [Charge card] → [Email] → [DB] → [Slack] → [Analytics] → Response
                                ↑
             If ANY step fails, what happens?

## The Fix: Which Steps Are Critical?
Separate "must happen before response" from "can happen later":

CRITICAL (synchronous — block response):
-
-

NON-CRITICAL (async — can happen in background):
-
-
-

## New Architecture

User → [API Server]
           ↓
    [Charge Stripe]
           ↓
    [Create DB record] ← critical
           ↓
    ???  ← how does the rest get triggered?
           ↓
    Return "Payment successful" to user

## The Queue

What goes into the queue?

Message example:
{
  "event": "payment.completed",
  "data": {
    ???
  }
}

## Workers / Consumers

Who reads from the queue and does what?

Worker 1 (EmailWorker): listens for ___, does ___
Worker 2 (SlackWorker): listens for ___, does ___
Worker 3 (AnalyticsWorker): listens for ___, does ___

## Handling Failures

What if the email worker crashes mid-send?

What does "idempotent" mean here and why does it matter?

## Retry Strategy
`,
  solution: `# Async Payment Architecture

## Current Problem (Synchronous Flow)
User click → [Charge card] → [Email] → [DB] → [Slack] → [Analytics] → Response
                                ↑
If Slack API is down, card is charged but no subscription created.
If request times out, we don't know what completed.
User retries → duplicate charge.

## The Fix: Which Steps Are Critical?

CRITICAL (synchronous — block response):
- Charge the card (Stripe)
- Create subscription record in DB
→ These two must succeed together (atomically) before we respond.

NON-CRITICAL (async — can happen in background):
- Send confirmation email (user can wait a few seconds)
- Post Slack notification (internal — latency irrelevant)
- Update analytics (batch-tolerant)
- Generate invoice PDF
→ If these fail, we retry. User experience is not blocked.

## New Architecture

User → [API Server]
           ↓
    1. Charge Stripe ($)          ← critical, do first
           ↓
    2. Create DB subscription     ← critical, do second
           ↓                         (if this fails, refund Stripe)
    3. Publish event to Queue ──→ [Message Queue: "payment.completed"]
           ↓
    4. Return "Payment successful" to user   ← user sees this in ~500ms

[Message Queue] distributes to workers:
    ├── [EmailWorker]      → sends confirmation email
    ├── [SlackWorker]      → posts to #new-customers
    └── [AnalyticsWorker]  → updates Segment / MixPanel

## The Queue

Technology options: Kafka, RabbitMQ, AWS SQS, Redis Streams

Message published after successful payment:
{
  "event": "payment.completed",
  "idempotency_key": "pmt_abc123",   ← prevents duplicate processing
  "timestamp": "2024-01-15T09:14:00Z",
  "data": {
    "user_id": "usr_789",
    "plan": "pro",
    "amount_cents": 999,
    "stripe_charge_id": "ch_xyz"
  }
}

## Workers / Consumers

Worker 1 (EmailWorker):
  - Listens for: "payment.completed"
  - Does: sends "Thanks for subscribing!" email via SendGrid
  - On failure: retry 3x with exponential backoff, then dead-letter queue

Worker 2 (SlackWorker):
  - Listens for: "payment.completed"
  - Does: POST to Slack webhook #new-customers
  - On failure: retry 2x, then drop (Slack notification is non-critical)

Worker 3 (AnalyticsWorker):
  - Listens for: "payment.completed"
  - Does: sends event to Segment/Amplitude
  - On failure: retry 5x, buffer locally, then batch send

## Handling Failures

If the email worker crashes mid-send:
- The message stays in the queue (unacknowledged)
- Queue redelivers to another worker after a timeout
- Worker 2 sends the email (possibly a second time)
→ This is why idempotency matters: sending the same email twice = bad UX

Idempotency here means:
- Before sending email, check: "Have I already sent email for payment pmt_abc123?"
- Store a record: "email sent for pmt_abc123 at 09:14:05"
- If duplicate message arrives: skip, already done

## Retry Strategy
Exponential backoff: wait 1s, 2s, 4s, 8s, 16s between retries
After N failures: move to Dead Letter Queue (DLQ) for manual inspection
Alert on-call engineer when DLQ has messages
Never retry payment charges without explicit human action`,
  explanation: `## Why Message Queues Exist

The core idea: **decouple what must happen now from what can happen later**.

### Synchronous vs Asynchronous
- **Synchronous**: A calls B, waits for B to finish, then continues. If B is slow or crashes, A is blocked.
- **Asynchronous**: A publishes a message to a queue, immediately continues. B reads the message when it's ready.

### The Queue Guarantees
A good message queue gives you:
1. **Durability**: messages survive crashes (written to disk)
2. **Delivery**: at-least-once delivery — messages are not lost
3. **Ordering**: FIFO within a partition (Kafka, SQS FIFO)
4. **Fan-out**: one message delivered to multiple consumers

### At-Least-Once vs Exactly-Once
Most queues guarantee **at-least-once** delivery, not exactly-once.
This means a message CAN be delivered twice (network retry, worker crash).
Your consumers MUST be idempotent.

### Popular Queue Technologies
| Technology | Use Case |
|---|---|
| **Kafka** | High-throughput event streaming, event sourcing |
| **RabbitMQ** | Traditional job queues, flexible routing |
| **AWS SQS** | Simple managed queues on AWS |
| **Redis Streams** | Lightweight, already using Redis |
| **Bull/BullMQ** | Node.js job queues on Redis |

### The Dead Letter Queue (DLQ)
Messages that fail after N retries go to a DLQ.
This prevents a bad message from blocking the queue forever.
Engineers inspect the DLQ manually and decide: fix & reprocess or discard.`,
  takeaway: "Decouple critical path (payment) from non-critical tasks (email, analytics) using a message queue. Critical = synchronous. Non-critical = async with retry.",
  tags: ["message-queues", "async", "kafka", "rabbitmq", "sqs", "idempotency", "reliability"],
  estimatedMinutes: 25,
}

export default lesson
