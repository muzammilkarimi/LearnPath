import type { Lesson } from "@/lib/types"

const lesson: Lesson = {
  id: "sd-02-caching",
  tech: "system-design",
  pathId: "foundations",
  order: 2,
  title: "The Database Bottleneck",
  storyTitle: "Every Request Is a Query",
  storyContext: `Three months later. Your app is growing. You've scaled to 5 servers behind a load balancer. But something's still wrong.

📩 **Monitoring alert (2:00 PM):** "Database CPU: 94%. Response time p99: 8.2s"

📩 **Alex:** "The servers are fine but everything is slow. What's happening?"

You dig into the query logs. Every single page load fires 8–20 database queries. The user's profile: 1 query. Their posts: 1 query per post. Comments: 1 query per comment. Follower count: 1 query. All hitting PostgreSQL on every request.

📩 **You:** "The DB is being hammered. There are 50,000 users but 99% of profile requests are asking for the same data — it barely changes. We're querying the DB for @elonmusk's profile 10,000 times per minute."

📩 **Alex:** "Can we just make the queries faster?"

📩 **You:** "We've got indexes everywhere. The problem isn't the query speed — it's the volume. We need to stop asking the database for the same answer over and over. We need a cache."`,
  concept: "Caching & Redis",
  challenge: `Design a caching layer for a social media platform where:
- User profiles are read 10,000x/min but updated <10x/day
- The trending feed is computed from millions of posts, takes 2s to generate
- User sessions need to be shared across 5 API servers
- 99% of traffic is reads

Fill in the design below. Cover: what to cache, where, for how long, and what happens when cached data goes stale.`,
  starterCode: `# Caching Strategy Design

## What Should We Cache?
List the data that's expensive to fetch but rarely changes:
1.
2.
3.

## Where Does the Cache Live?
Options:
- In-memory on each server (local cache)
- Shared external cache (Redis/Memcached)

My choice and why:

## Cache Architecture

User Request
    ↓
[API Server]
    ↓
[???] ← cache hit?
    ↓ cache miss
[PostgreSQL]

## Cache Keys
How would you key the cache entries?
- User profile:   cache key = ___
- Trending feed:  cache key = ___
- User session:   cache key = ___

## TTL (Time To Live)
How long should each item stay in cache?
- User profile:   TTL = ___ (because ___)
- Trending feed:  TTL = ___ (because ___)
- User session:   TTL = ___ (because ___)

## Cache Invalidation
What happens when a user updates their profile?

## What Can Go Wrong?
- Cache miss storm (cold start):
- Stale data problem:
- Cache eviction: `,
  solution: `# Caching Strategy Design

## What Should We Cache?
1. User profiles — read constantly, updated rarely
2. Trending/home feed — expensive to compute (2s), can be slightly stale
3. User sessions — needed by all 5 servers, short-lived
4. Post counts, follower counts — aggregate queries, expensive, read-heavy
5. Static content metadata — bio, avatar URL, username

## Where Does the Cache Live?
→ Shared external cache: **Redis**

Why NOT local in-memory cache:
- We have 5 servers — each would have its own cache
- User updates profile on Server 1; Servers 2–5 still serve stale data
- Memory is wasted (5x duplication)
- Redis gives us one source of truth across all servers

## Cache Architecture

User Request
    ↓
[API Server]  ──→ [Redis Cache]  ← HIT: return instantly (< 1ms)
                       ↓ MISS
                  [PostgreSQL]   ← query DB, store result in Redis
                       ↓
                  return to user + populate cache

## Cache Keys
Consistent, readable key format: "{type}:{id}:{field}"

- User profile:   "user:profile:12345"
- Trending feed:  "feed:trending:global" or "feed:home:user:12345"
- User session:   "session:abc123xyz"
- Follower count: "user:followers:count:12345"

## TTL (Time To Live)
- User profile:   TTL = 1 hour (profiles rarely change;
                  on update, explicitly delete the key)
- Trending feed:  TTL = 5 minutes (acceptable staleness for feed)
- User session:   TTL = 30 minutes, refresh on each request
- Follower count: TTL = 10 minutes (eventual consistency is fine)

## Cache Invalidation
When a user updates their profile:
1. Write the update to PostgreSQL (source of truth)
2. DELETE "user:profile:12345" from Redis (cache bust)
3. Next request will be a cache miss → fetches fresh from DB → repopulates

Write-through alternative: write to cache AND DB simultaneously.
Cache-aside (above) is simpler and more common.

## What Can Go Wrong?

**Cache miss storm (Thundering Herd):**
If Redis goes down and restarts cold, every request hits the DB at once.
Fix: warm the cache on startup; use request coalescing (only one
request fetches from DB, others wait for that result).

**Stale data:**
A user updates their name but 1,000 people still see the old name
for up to 1 hour. For most social apps this is acceptable.
For bank balances: TTL = 0 (never cache).

**Cache eviction:**
Redis has a max memory limit. When full, it evicts keys by policy:
- LRU (Least Recently Used): evict items not accessed recently
- LFU (Least Frequently Used): evict least popular items
Set maxmemory-policy allkeys-lru for most web apps.`,
  explanation: `## The Cache Mental Model

A cache sits between your application and your database and answers:
**"Have I seen this question before? Here's the answer I memorized."**

### Cache Hit vs Miss
- **Cache hit**: Redis has the answer → returns in < 1ms
- **Cache miss**: Redis doesn't have it → query DB → store in Redis → return

### The Three Cache Patterns

**1. Cache-Aside (Lazy Loading)**
\`\`\`
read(key):
  val = cache.get(key)
  if val is None:
    val = db.query(key)
    cache.set(key, val, ttl=3600)
  return val
\`\`\`
Most common. Only cache data that's actually requested.

**2. Write-Through**
On every write: update DB AND update cache simultaneously.
Keeps cache always fresh. Wastes cache space on rarely-read data.

**3. Write-Behind (Write-Back)**
Write to cache first, async flush to DB later.
Faster writes. Risk of data loss if cache crashes before flush.

### What NOT to Cache
- User-specific financial data (bank balance, payments)
- Data that must be instantly consistent
- Data that changes on every request
- Very large objects that eat all your cache memory

### Redis Beyond Caching
Redis is also used for:
- **Session store** — shared sessions across servers
- **Rate limiting** — increment counters per IP per minute
- **Pub/Sub** — real-time notifications
- **Job queues** — background task queues
- **Leaderboards** — sorted sets for rankings`,
  takeaway: "Cache what you read often but update rarely. Use Redis as a shared cache across servers. Always have a TTL — nothing lives in cache forever.",
  tags: ["caching", "redis", "database", "performance", "ttl", "cache-invalidation"],
  estimatedMinutes: 22,
}

export default lesson
