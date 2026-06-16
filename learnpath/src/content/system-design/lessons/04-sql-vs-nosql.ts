import type { Lesson } from "@/lib/types"

const lesson: Lesson = {
  id: "sd-04-sql-vs-nosql",
  tech: "system-design",
  pathId: "foundations",
  order: 4,
  title: "The Architecture Meeting",
  storyTitle: "SQL vs NoSQL: The Decision That Lasts 10 Years",
  storyContext: `Your startup is building a new feature: a real-time activity feed. Think Twitter's timeline or LinkedIn's feed. Before writing a single line of code, your CTO calls a meeting.

📩 **CTO (Marcus):** "Before we build the feed, we need to decide on the database. I've seen teams make the wrong call here and spend 2 years migrating. What are we using — SQL or NoSQL?"

📩 **Senior Dev (Priya):** "The feed has unpredictable schema — different activity types have totally different fields. SQL might be too rigid."

📩 **Backend Dev (Tom):** "But we need consistency. If someone posts something, every user who follows them needs to see it. NoSQL eventual consistency scares me."

📩 **You:** "And we're talking about 500M+ feed events per day at scale. That's a write-heavy workload."

Marcus turns to you:

📩 **Marcus:** "You've been researching this. Walk us through the decision. What are the tradeoffs and what do you recommend?"

The room goes quiet. This is your call.`,
  concept: "SQL vs NoSQL",
  challenge: `Make the database decision for a social media activity feed that will store:
- 500M events/day (posts, likes, comments, follows, shares)
- Each event has different fields depending on type
- Users query their feed: "give me the last 50 events from people I follow"
- The system must handle 100,000 writes/second at peak
- Data must be retained for 2 years (growing dataset)

Justify your decision with concrete tradeoffs.`,
  starterCode: `# Database Decision: Activity Feed

## Understanding the Access Patterns
Most important: HOW will we read and write this data?

Reads:
- Query: "Give me the last 50 events for user X's feed"
- Frequency: ___ reads/sec (each user refreshes many times/day)
- Pattern: mostly by user_id + sorted by time

Writes:
- When user does something → write event
- Volume: ___/day = ___/second
- Pattern: high-volume inserts, almost no updates

## SQL Option (PostgreSQL)

Schema:
\`\`\`sql
-- How would you model the activity feed in SQL?
CREATE TABLE activities (
  ???
);
\`\`\`

Pros for this use case:
-

Cons for this use case:
-

## NoSQL Option (Choose one: MongoDB / Cassandra / DynamoDB)

Why this specific NoSQL DB?

Data model:
\`\`\`json
{
  ???
}
\`\`\`

Pros for this use case:
-

Cons for this use case:
-

## My Decision
I recommend ___ because:

## CAP Theorem Consideration
This system needs ___ (Consistency / Availability / Partition Tolerance)?

What tradeoff are we accepting?
`,
  solution: `# Database Decision: Activity Feed

## Understanding the Access Patterns

Reads:
- Query: "Give me the last 50 events for user X's feed, sorted by time"
- ~10M reads/day = ~115 reads/sec baseline, 10,000/sec at peak
- Pattern: by user_id + ordered by timestamp (time-series like)

Writes:
- 500M events/day = ~5,800 writes/sec average, 100,000/sec at peak
- Pattern: append-only inserts, almost no updates or deletes
- Schema varies: a "like" event has post_id; a "follow" event has target_user_id

## SQL Option (PostgreSQL)

\`\`\`sql
CREATE TABLE activities (
  id           BIGSERIAL PRIMARY KEY,
  user_id      BIGINT NOT NULL,        -- who performed the action
  type         VARCHAR(50) NOT NULL,   -- 'post', 'like', 'follow', 'share'
  target_id    BIGINT,                 -- post_id or user_id depending on type
  metadata     JSONB,                  -- flexible fields per type
  created_at   TIMESTAMP NOT NULL,
  INDEX (user_id, created_at DESC)
);
\`\`\`

Pros:
- ACID transactions — guaranteed consistency
- Flexible JSONB for varying fields per event type
- Complex queries (joins, aggregations) if needed
- Familiar, mature, excellent tooling

Cons:
- 500M rows/day → billions of rows → single-node PostgreSQL will struggle
- Sharding PostgreSQL is painful
- 100,000 writes/sec will overwhelm a standard Postgres setup
- Requires significant infrastructure tuning at this scale

## NoSQL Option: Apache Cassandra

Why Cassandra specifically:
- Designed for write-heavy, time-series workloads at massive scale
- Linear horizontal scaling: add nodes, get linear throughput increase
- Handles 100,000 writes/sec per node
- Built-in time-series ordering by clustering key

\`\`\`
Table: user_feed
Partition key: (viewer_id)         ← all events for one user on same node
Clustering key: (created_at DESC)  ← sorted newest first automatically

Row: {
  viewer_id:  123,
  created_at: 2024-01-15T09:14:00,
  type:       "like",
  actor_id:   456,        -- who did the action
  target_id:  789,        -- which post was liked
  metadata:   { "post_preview": "..." }
}
\`\`\`

Pros:
- Handles 100K writes/sec with ease (what it's built for)
- Automatic time-ordering via clustering keys
- Horizontally scalable — add nodes as data grows
- Great for fan-out writes (write to many followers' feeds)

Cons:
- Eventual consistency — a user might not see a new event for milliseconds
- No joins — each query must be designed around access patterns
- Schema changes are painful
- Overkill for < 10,000 writes/sec

## My Decision

**Cassandra** for the activity feed events.
Reason: write volume (100K/sec) and dataset size (billions of rows/year)
make single-node SQL impractical. The access pattern is simple and
well-suited to Cassandra's data model (partition by viewer, sort by time).

**Keep PostgreSQL** for:
- User accounts, subscriptions, billing
- Content (posts, comments) — where ACID matters
- Analytics aggregations

Use the right tool for each job.

## CAP Theorem

This system prioritizes: **Availability + Partition Tolerance (AP)**

Tradeoff we're accepting: **Eventual Consistency**

Justification:
- If a user posts something and their follower sees it 200ms later instead
  of instantly, that's acceptable for a social feed.
- If the database partition heals in seconds, feeds converge.
- Contrast: a bank balance MUST be CP — you cannot show a stale balance.
  Eventual consistency for money = fraud.`,
  explanation: `## SQL vs NoSQL Decision Framework

Don't ask "which is better?" — ask "which fits this access pattern?"

### When to Use SQL (PostgreSQL, MySQL)
- Complex relationships with JOINs
- ACID transactions required (banking, inventory)
- Flexible ad-hoc queries (reporting, analytics)
- Schema is stable and well-defined
- < 10K writes/sec (manageable load)

### When to Use NoSQL
| Type | Examples | Best For |
|---|---|---|
| Document | MongoDB, Firestore | Flexible schema, nested data, rapid iteration |
| Wide-Column | Cassandra, DynamoDB | Time-series, write-heavy, horizontal scale |
| Key-Value | Redis, DynamoDB | Caching, sessions, simple lookups |
| Graph | Neo4j | Social graphs, recommendations |
| Search | Elasticsearch | Full-text search, log analysis |

### The CAP Theorem
In a distributed system, you can only guarantee 2 of 3:
- **C**onsistency — every read sees the latest write
- **A**vailability — every request gets a response
- **P**artition Tolerance — system works even if nodes can't talk

Network partitions are inevitable. So real choice is **CP vs AP**:
- **CP** (Consistent + Partition-tolerant): HBase, Zookeeper. Some requests fail during partition. Used for: money, inventory.
- **AP** (Available + Partition-tolerant): Cassandra, DynamoDB. Returns possibly stale data. Used for: social feeds, DNS, shopping carts.

### Polyglot Persistence
Large systems use MULTIPLE databases:
- PostgreSQL for users, billing, content
- Cassandra for feeds, events, time-series
- Redis for sessions, rate limiting, caching
- Elasticsearch for search
- S3 for media files`,
  takeaway: "SQL for consistency and complex relationships; NoSQL for scale, flexible schema, or time-series data. The CAP theorem forces a tradeoff — know which consistency level your feature actually needs.",
  tags: ["sql", "nosql", "cassandra", "mongodb", "cap-theorem", "databases", "consistency"],
  estimatedMinutes: 25,
}

export default lesson
