import type { Lesson } from "@/lib/types"

const lesson: Lesson = {
  id: "sd-05-url-shortener",
  tech: "system-design",
  pathId: "foundations",
  order: 5,
  title: "Design a URL Shortener",
  storyTitle: "The Classic Interview Question",
  storyContext: `You're in a system design interview at a top tech company. The interviewer slides a blank whiteboard toward you.

📩 **Interviewer:** "Design a URL shortener. Like bit.ly or TinyURL. You have 45 minutes."

This is one of the most common system design interview questions — not because URL shorteners are complex, but because the answer reveals how you think about:
- Scale and capacity estimation
- Database design choices
- Hashing / ID generation
- Read-heavy workloads
- Caching
- Redirects and latency

📩 **You (thinking):** "Okay. Before I jump to architecture, I need to ask the right questions. The requirements determine everything."

The interviewer nods: "Go ahead — ask what you need to know."`,
  concept: "End-to-End System Design",
  challenge: `Design a URL shortener (bit.ly / TinyURL) from scratch.

Requirements (given by interviewer):
- 100M new URLs shortened per day
- 10B redirect requests per day (100:1 read-to-write ratio)
- URLs must not expire (or have optional expiry)
- Short URLs should be as short as possible
- System must handle 100,000 redirects/second at peak

Work through the full design below.`,
  starterCode: `# URL Shortener — System Design

## Step 1: Clarify Requirements

Functional requirements (what the system does):
1.
2.
3.

Non-functional requirements (how well it does it):
1. Availability: ___% uptime
2. Latency: redirect must complete in < ___ ms
3. Scale: ___ new URLs/day, ___ redirects/day

## Step 2: Capacity Estimation

Storage:
- 100M new URLs/day × 365 days × 5 years = ___ URLs total
- Each URL record ≈ 500 bytes (long URL + short code + metadata)
- Total storage = ___

Throughput:
- Writes: 100M/day = ___ writes/second
- Reads:  10B/day  = ___ reads/second

## Step 3: API Design

Shorten URL:
POST /shorten
Body: { "long_url": "https://..." }
Response: { "short_url": "https://sho.rt/abc123" }

Redirect:
??? /???
Response: ???

## Step 4: Short Code Generation

How do you generate a unique 6-7 character code for each URL?

Option A — Hash the URL (MD5/SHA256, take first 7 chars):
Problem with this approach:

Option B — Auto-increment ID + Base62 encode:
How it works:
Example: ID 12345 → Base62 → ___
Advantages:

## Step 5: Database Schema

Table: urls
\`\`\`
| column      | type     | notes |
|-------------|----------|-------|
| ???         |          |       |
\`\`\`

Which database? SQL or NoSQL? Why?

## Step 6: Architecture

Client → ??? → ??? → ???

Where does the cache fit?

## Step 7: Bottlenecks & Solutions

Bottleneck 1: 100,000 reads/sec is too many DB queries
Solution:

Bottleneck 2: Single DB write node
Solution:

Bottleneck 3: ???
Solution:
`,
  solution: `# URL Shortener — System Design

## Step 1: Clarify Requirements

Functional:
1. Given a long URL, return a unique short URL (≤ 7 chars)
2. Given a short URL, redirect to the original long URL
3. Optional: custom aliases, expiry dates, click analytics

Non-functional:
1. Availability: 99.99% (4 nines) — redirects are mission-critical
2. Latency: redirect < 50ms (user is waiting)
3. Scale: 100M writes/day, 10B reads/day

## Step 2: Capacity Estimation

Storage:
- 100M URLs/day × 365 × 5 years = 182.5B URLs
- Realistically store 5 years of active URLs: ~10B URLs
- Each record: short_code(7B) + long_url(200B) + metadata(100B) ≈ 307B
- Total: 10B × 307B ≈ 3 TB (very manageable)

Throughput:
- Writes: 100M / 86,400s ≈ 1,160 writes/sec
- Reads:  10B  / 86,400s ≈ 115,700 reads/sec (peak: 2-3x = ~300K/sec)

Key insight: 100:1 read-to-write ratio → optimize for reads.

## Step 3: API Design

POST /api/shorten
Body:    { "long_url": "https://example.com/very/long/url" }
Returns: { "short_url": "https://sho.rt/aB3kX9", "expires_at": null }

GET /{code}                          ← the redirect endpoint
Returns: HTTP 301/302 redirect to long URL
  - 301 Permanent: browser caches it (fewer future requests, can't track clicks)
  - 302 Temporary: browser always asks us (allows analytics, more load on us)
  → Use 302 if you need click tracking. 301 if you want to minimize server load.

## Step 4: Short Code Generation

Option A — Hash (MD5 first 7 chars): "https://google.com" → "ab3f9kx"
Problem: hash collisions (two different URLs → same hash).
Need to handle collision: check DB, if collision append +1 and rehash.
Also: same URL always gets same hash → can't have multiple short codes for one URL.

Option B — Auto-increment ID + Base62 ✅ (recommended)
1. DB auto-increments: ID = 12,345,678
2. Convert to Base62: digits 0-9, a-z, A-Z (62 chars)
   12,345,678 in Base62 = "FpAn6"
3. 62^7 = 3.5 trillion unique codes — enough for centuries

Why Base62 > Base64:
Base64 uses + and / which are URL-unsafe. Base62 is URL-safe.

7 characters → 62^7 = 3.5 trillion unique URLs.

## Step 5: Database Schema

\`\`\`
Table: urls
| column      | type         | notes                        |
|-------------|--------------|------------------------------|
| id          | BIGINT PK    | auto-increment, becomes code |
| short_code  | VARCHAR(7)   | unique index                 |
| long_url    | TEXT         | the original URL             |
| user_id     | BIGINT       | nullable (anonymous ok)      |
| created_at  | TIMESTAMP    | indexed                      |
| expires_at  | TIMESTAMP    | nullable                      |
| click_count | BIGINT       | updated async                |
\`\`\`

Database choice: PostgreSQL
- 1,160 writes/sec: trivially handled
- Simple schema, ACID for URL uniqueness
- Read replicas for the 300K reads/sec
- NoSQL unnecessary at this scale/complexity

## Step 6: Architecture

[Client]
   ↓
[CDN / Cloudflare] ← caches 301 redirects at edge worldwide
   ↓ cache miss
[Load Balancer]
   ↓
[API Servers × N]  ← stateless, auto-scale
   ↓         ↓
[Redis Cache]  [PostgreSQL]
  (short_code → long_url, TTL=24h)   (primary + 2 read replicas)

Write flow:
1. POST /shorten → API server
2. Insert into PostgreSQL → get auto-increment ID
3. Encode ID to Base62 → short_code
4. Update row with short_code
5. Cache: SET "code:aB3kX9" "https://long-url.com" EX 86400
6. Return short URL to user

Read flow:
1. GET /aB3kX9 → API server
2. Redis.GET("code:aB3kX9") → HIT? Redirect immediately (< 5ms)
3. MISS: Query PostgreSQL read replica → set in Redis → redirect
4. Async: increment click_count in background

## Step 7: Bottlenecks & Solutions

Bottleneck 1: 300K reads/sec overwhelms DB
Solution: Redis cache with 24h TTL. Cache hit rate ~99% for popular URLs.
Only 3,000 reads/sec hit the DB (cache misses).

Bottleneck 2: Single write master
Solution: At 1,160 writes/sec, one PostgreSQL master handles this easily.
If needed later: shard by first character of short_code (62 shards).

Bottleneck 3: Global latency (user in Tokyo hits US server)
Solution: CDN caches 301 redirects at 300+ edge locations worldwide.
Tokyo users redirect in < 10ms without touching origin servers.

Bottleneck 4: click_count updates at 300K/sec would lock the DB
Solution: Don't update synchronously. Batch writes:
- API server publishes "click" event to a queue
- AnalyticsWorker aggregates and batch-writes to DB every minute`,
  explanation: `## How to Approach Any System Design Interview

The URL shortener is a template for solving ALL system design questions.
Follow this framework every time:

### The 5-Step Framework

**1. Clarify Requirements (5 min)**
Never start designing without asking:
- What are the functional requirements?
- What scale? (users, requests/sec, data size)
- What's the read:write ratio?
- Any special constraints? (latency, consistency, cost)

**2. Capacity Estimation (5 min)**
Back-of-envelope math:
- Storage: records × record size × retention period
- Throughput: events/day ÷ 86,400 = events/sec
- Bandwidth: throughput × request size

**3. API Design (3 min)**
Define the interface before the internals.
What endpoints? What inputs/outputs? What HTTP status codes?

**4. Database Design (5 min)**
- Schema / data model
- SQL vs NoSQL choice with justification
- Indexing strategy

**5. High-Level Architecture → Deep Dive (20 min)**
Draw the boxes:
Client → CDN → LB → API Servers → Cache → Database

Then zoom into the hard parts:
- How does the short code get generated?
- What happens on cache miss?
- How does the system handle 10x traffic spike?
- Single points of failure?

### Red Flags Interviewers Watch For
- Jumping to architecture without asking requirements
- Not estimating scale
- Ignoring the cache (everything needs a cache)
- Saying "NoSQL is faster" without explaining why
- Designing for 10x more scale than needed
- Not mentioning failure scenarios`,
  takeaway: "Every system design interview follows the same structure: requirements → estimation → API → DB → architecture → bottlenecks. The URL shortener teaches all five in one compact problem.",
  tags: ["system-design", "url-shortener", "base62", "caching", "interview", "architecture"],
  estimatedMinutes: 30,
}

export default lesson
