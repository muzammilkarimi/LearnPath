import type { Lesson } from "@/lib/types"

const lesson: Lesson = {
  id: "sd-01-scaling",
  tech: "system-design",
  pathId: "foundations",
  order: 1,
  title: "The Viral Moment",
  storyTitle: "Hacker News Front Page — 9:14 AM",
  storyContext: `You built a side project over the weekend. Monday morning it gets posted to Hacker News.

📩 **Slack (9:14 AM):** "hey your app is on the front page of HN"

📩 **Slack (9:16 AM):** "it's down"

You open the server dashboard. CPU: 100%. Memory: 100%. The single $20/month VPS you're running on is completely maxed. 50,000 people tried to visit in 2 minutes.

Your co-founder messages:

📩 **Alex:** "Just upgrade to a bigger server, right? Like the $200 plan?"

📩 **You:** "That buys us maybe 10x capacity. But what if we go viral again? And what happens when THAT server maxes out?"

📩 **Alex:** "So what do we do instead?"

This is the moment every engineer hits. And the answer is the foundation of all system design: **scaling**.`,
  concept: "Horizontal vs Vertical Scaling",
  challenge: `Design a scaling strategy for a web app that:
- Currently runs on 1 server handling 100 req/s
- Needs to handle 10,000 req/s during viral spikes
- Has a stateless API (each request is independent)
- Uses a PostgreSQL database

Fill in the design doc below. Cover: what type of scaling you'd use, how the architecture changes, and what tradeoffs you're accepting.`,
  starterCode: `# Scaling Strategy Design

## The Problem
- Current: 1 server, 100 req/s max
- Goal: 10,000 req/s during spikes
- Constraint: stateless API, PostgreSQL DB

## Option A: Vertical Scaling ("Scale Up")
What it is:

Pros:
-

Cons:
-

## Option B: Horizontal Scaling ("Scale Out")
What it is:

Pros:
-

Cons:
-

## My Recommendation
I would choose ___ because:

## Architecture After Scaling
(Describe what the system looks like)

User → [???] → [???] → [???]

## What About the Database?
How does the DB factor into this?

## Open Questions / Tradeoffs
- `,
  solution: `# Scaling Strategy Design

## The Problem
- Current: 1 server, 100 req/s max
- Goal: 10,000 req/s during spikes
- Constraint: stateless API, PostgreSQL DB

## Option A: Vertical Scaling ("Scale Up")
What it is: Replace the current server with a bigger one
(more CPU cores, more RAM, faster storage).

Pros:
- Simple — no architecture changes needed
- No code changes required
- Easy to reason about (still one machine)

Cons:
- Hard ceiling — the biggest available machine has limits
- Single point of failure — if it crashes, everything is down
- Expensive at the top end (128-core machines cost $$$)
- Cannot scale incrementally during a spike

## Option B: Horizontal Scaling ("Scale Out")
What it is: Add more servers of the same size and
distribute traffic between them using a Load Balancer.

Pros:
- No theoretical ceiling — add as many servers as needed
- Redundancy — if one server crashes, others absorb traffic
- Can auto-scale up/down based on traffic (cost efficient)
- Incremental scaling during spikes

Cons:
- More complex architecture
- Need a Load Balancer (adds latency, cost, one more thing to manage)
- Session/state must NOT be stored on the server (stateless constraint)
- Database becomes the new bottleneck

## My Recommendation
Horizontal scaling — because vertical scaling has a hard ceiling
and a single point of failure. Since our API is already stateless,
each request can be handled by any server, making horizontal scaling
straightforward.

## Architecture After Scaling

User → [Load Balancer] → [API Server 1]  ─┐
                        → [API Server 2]  ─┼→ [PostgreSQL DB]
                        → [API Server 3]  ─┘
                        → [API Server N]  (auto-scales)

Auto Scaling Group: automatically adds/removes servers
based on CPU/request metrics. At 70% CPU → add server.
At 20% CPU → remove server.

## What About the Database?
The DB is now the shared bottleneck for all API servers.
Mitigation strategies:
1. Add a read replica — route all SELECT queries to replicas,
   only writes go to primary.
2. Add a cache (Redis) — avoid hitting DB for repeated reads.
3. Connection pooling (PgBouncer) — prevent connection exhaustion
   from many API servers.

The DB doesn't scale horizontally as easily as stateless servers —
this is why caching and read replicas matter.

## Open Questions / Tradeoffs
- Load balancer is now a single point of failure → use managed LB
  (AWS ALB, Cloudflare) which are redundant by design
- Session data must live in Redis, not in server memory
- Database still scales vertically + read replicas for now;
  sharding is a later-stage problem
- Cost: horizontal scaling with auto-scaling can be cheaper
  than a permanent beefy server`,
  explanation: `## Vertical vs Horizontal Scaling

**Vertical scaling** (scale up) = bigger machine.
**Horizontal scaling** (scale out) = more machines.

The industry almost always ends up at horizontal scaling because:
- You hit a ceiling with vertical scaling
- A single machine is a single point of failure
- Horizontal scaling can be automated (auto-scaling groups)

### The Stateless Requirement
Horizontal scaling only works cleanly if servers are **stateless** —
each request carries everything needed to process it (JWT token, request body),
and no server-local memory (like sessions) is used.

If a user's session lives on Server 1 and their next request hits Server 2,
Server 2 has no idea who they are. Fix: store sessions in a shared store (Redis).

### Load Balancer Algorithms
- **Round robin**: request 1 → server 1, request 2 → server 2, etc.
- **Least connections**: send to whichever server has fewest active requests
- **IP hashing**: always route same user IP to same server (useful for soft state)

### Auto Scaling
Cloud providers (AWS, GCP, Azure) let you define rules:
- CPU > 70% for 2 minutes → add 2 servers
- CPU < 20% for 10 minutes → remove servers
- Max cap: 50 servers (cost protection)

This means you pay for what you use — 1 server overnight, 20 during a traffic spike.`,
  takeaway: "Vertical scaling has a hard ceiling and a single point of failure. Horizontal scaling + a load balancer is how the internet actually works — but it requires stateless servers.",
  tags: ["scaling", "load-balancing", "horizontal-scaling", "vertical-scaling", "auto-scaling"],
  estimatedMinutes: 20,
}

export default lesson
