import type { InterviewQuestion } from "@/lib/types"

const questions: InterviewQuestion[] = [
  {
    id: "sd-q-01",
    tech: "system-design",
    question: "What is the difference between horizontal and vertical scaling?",
    shortAnswer:
      "Vertical scaling = bigger machine (more CPU/RAM). Horizontal scaling = more machines behind a load balancer. Horizontal scales without a ceiling and eliminates single points of failure, but requires stateless servers.",
    answer:
      "Vertical scaling (scale up) means upgrading to a more powerful single machine. It's simple but has a hard ceiling — there's only so big a machine you can buy — and remains a single point of failure. Horizontal scaling (scale out) means adding more machines of the same size and distributing load with a load balancer. It has no theoretical ceiling and provides redundancy, but requires stateless servers (session data in shared storage like Redis, not in server memory). Most production systems are horizontally scaled.",
    difficulty: "beginner",
    tags: ["scaling", "load-balancing", "fundamentals"],
    followUps: [
      "When would you prefer vertical scaling over horizontal?",
      "What does it mean for a server to be stateless?",
    ],
  },
  {
    id: "sd-q-02",
    tech: "system-design",
    question: "Explain caching and the main cache invalidation strategies.",
    shortAnswer:
      "A cache stores results of expensive operations so they can be returned instantly on repeat requests. Invalidation strategies: TTL (expire after N seconds), write-through (update cache on every write), cache-aside (delete on write, repopulate on next read).",
    answer:
      "A cache sits between your app and database, storing frequently-read data in fast memory (like Redis) so you don't query the DB for the same data repeatedly. The three main invalidation strategies: (1) TTL — cache entries expire automatically after N seconds; simple but can serve stale data. (2) Write-through — write to DB and cache simultaneously; keeps cache fresh but wastes memory on rarely-read data. (3) Cache-aside (lazy loading) — app reads from cache; on miss, reads from DB, writes to cache; on update, deletes cache key. Cache-aside is most common. The hard problem in CS: 'There are only two hard things: naming things and cache invalidation.'",
    difficulty: "beginner",
    tags: ["caching", "redis", "ttl", "cache-invalidation"],
    followUps: [
      "What is a cache stampede and how do you prevent it?",
      "When should you NOT cache something?",
    ],
  },
  {
    id: "sd-q-03",
    tech: "system-design",
    question: "What is the CAP theorem?",
    shortAnswer:
      "In a distributed system that experiences network partitions (which you can't avoid), you must choose between Consistency (every read gets the latest write) and Availability (every request gets a response). CP = consistent but some requests fail during partition. AP = always responds but may return stale data.",
    answer:
      "The CAP theorem states that a distributed system can only guarantee 2 of 3 properties: Consistency (every read reflects the most recent write), Availability (every request receives a response), and Partition Tolerance (system continues despite network failures between nodes). Since network partitions are unavoidable in distributed systems, the real choice is between CP and AP. CP systems (HBase, Zookeeper) may reject requests during a partition but ensure consistency — good for banking. AP systems (Cassandra, DynamoDB) always respond but may return stale data — good for social feeds, DNS, shopping carts.",
    difficulty: "intermediate",
    tags: ["cap-theorem", "consistency", "availability", "distributed-systems"],
    followUps: [
      "Can you give a real-world example of an AP system?",
      "What is eventual consistency?",
    ],
  },
  {
    id: "sd-q-04",
    tech: "system-design",
    question: "When would you use a message queue and why?",
    shortAnswer:
      "Use a message queue to decouple producers from consumers, handle traffic spikes, enable async processing, and add resilience. Instead of calling a service directly (synchronous), publish a message; the consumer processes it when ready.",
    answer:
      "Message queues (Kafka, RabbitMQ, SQS) decouple the thing generating work from the thing doing the work. Use them when: (1) You want to do work asynchronously — e.g., send an email after a payment without blocking the user. (2) You need to absorb traffic spikes — queue fills up, workers drain it at their own pace. (3) You need retry logic — if a consumer fails, the message stays in the queue and is redelivered. (4) Fan-out — one event triggers multiple downstream services. Key properties: at-least-once delivery (consumers must be idempotent), durability (messages survive crashes), backpressure (producer slows down if queue is full).",
    difficulty: "intermediate",
    tags: ["message-queues", "kafka", "async", "reliability", "decoupling"],
    followUps: [
      "What is idempotency and why is it required for queue consumers?",
      "What is the difference between a queue and a pub/sub topic?",
    ],
  },
  {
    id: "sd-q-05",
    tech: "system-design",
    question: "How does database sharding work and when do you need it?",
    shortAnswer:
      "Sharding splits a database into horizontal partitions (shards) across multiple machines. Each shard holds a subset of rows. Shard by a key (user_id, geography) to distribute load. Needed when a single DB instance can't handle your data volume or write throughput.",
    answer:
      "Sharding horizontally partitions a database table across multiple independent database instances called shards. For example: users 1-1M → Shard A, users 1M-2M → Shard B. The shard key determines which shard holds a row. Common shard keys: user_id (consistent load distribution), geographic region, tenant_id. You need sharding when: a single DB instance can't store all your data, or write throughput exceeds one machine's capacity. Downsides: JOINs across shards are impossible, shard key must be chosen carefully (hot shards = one shard handles all traffic), and re-sharding later is painful. Prefer database read replicas + caching first; shard only when necessary.",
    difficulty: "advanced",
    tags: ["sharding", "database", "scaling", "partitioning"],
    followUps: [
      "What is a hot shard and how do you avoid it?",
      "How is sharding different from partitioning?",
    ],
  },
  {
    id: "sd-q-06",
    tech: "system-design",
    question: "What is consistent hashing and why is it used in distributed systems?",
    shortAnswer:
      "Consistent hashing maps both data keys and servers onto a ring. Each key is served by the nearest server clockwise. When a server is added/removed, only 1/N of keys need to move (not all of them), minimizing redistribution — critical for caches and distributed databases.",
    answer:
      "Consistent hashing places servers and data keys on an abstract ring (0 to 2^32). A key is assigned to the first server encountered clockwise on the ring. When a server is added, only the keys between it and its predecessor move. When a server is removed, only its keys move to the next server. This means adding/removing servers only redistributes 1/N of total keys, vs. modular hashing (key % N) which remaps almost everything when N changes. Used in: distributed caches (Memcached, Redis Cluster), distributed databases (Cassandra, DynamoDB), CDNs. Virtual nodes (vnodes) solve uneven key distribution by giving each server multiple positions on the ring.",
    difficulty: "advanced",
    tags: ["consistent-hashing", "distributed-systems", "caching", "partitioning"],
    followUps: [
      "What are virtual nodes (vnodes) and why are they needed?",
      "How does Cassandra use consistent hashing?",
    ],
  },
  {
    id: "sd-q-07",
    tech: "system-design",
    question: "How would you design a rate limiter?",
    shortAnswer:
      "A rate limiter controls how many requests a client can make in a time window. Common algorithms: token bucket (tokens refill at a fixed rate; burst allowed), sliding window (count requests in last N seconds), fixed window (reset count every N seconds — has edge-case burst problem).",
    answer:
      "A rate limiter prevents abuse by capping requests per user/IP per time window. Implementation options: (1) Token Bucket — each user has a bucket that fills at a fixed rate (e.g., 10 tokens/sec). Each request consumes a token. When empty, requests are rejected. Allows bursts up to bucket size. (2) Fixed Window — count requests per minute. Reset at :00. Problem: user can burst 200 requests in the last second of minute 1 and first second of minute 2. (3) Sliding Window — count requests in the last 60 seconds, rolling. More accurate, no edge-case burst. Store counters in Redis with atomic INCR + TTL. Return headers: X-RateLimit-Remaining, X-RateLimit-Reset. Return HTTP 429 when exceeded.",
    difficulty: "intermediate",
    tags: ["rate-limiting", "token-bucket", "redis", "api-design"],
    followUps: [
      "How does rate limiting work across multiple API servers?",
      "What's the difference between rate limiting and throttling?",
    ],
  },
  {
    id: "sd-q-08",
    tech: "system-design",
    question: "What is a CDN and when should you use one?",
    shortAnswer:
      "A CDN (Content Delivery Network) caches content at edge servers worldwide, close to users. Reduces latency for static assets (images, JS, CSS, videos) and offloads traffic from origin servers. Use when you have global users or heavy media traffic.",
    answer:
      "A CDN is a geographically distributed network of servers that caches content close to end users. When a user in Tokyo requests an image from a US-based server, latency might be 200ms. If a CDN edge server in Tokyo has the image cached, latency drops to 5ms. CDNs cache: static assets (JS, CSS, images, videos), API responses (with Cache-Control headers), and even full HTML pages. How it works: first request goes to origin, CDN caches the response, subsequent requests served from edge. Use CDNs for: global user bases, heavy media (video streaming), DDoS protection (CDN absorbs traffic), and reducing origin server load. Popular CDNs: Cloudflare, AWS CloudFront, Fastly, Akamai.",
    difficulty: "beginner",
    tags: ["cdn", "caching", "latency", "performance", "global"],
    followUps: [
      "What's the difference between a CDN and a reverse proxy?",
      "How do you invalidate CDN cache when you deploy new code?",
    ],
  },
  {
    id: "sd-q-09",
    tech: "system-design",
    question: "How would you design a notification system (push, email, SMS)?",
    shortAnswer:
      "Decouple event production from notification delivery using a message queue. Services publish events; workers route to the right channel (push/email/SMS) via third-party APIs. Use user preferences to filter channels. Handle failures with retry + dead letter queue.",
    answer:
      "Architecture: (1) Services publish events to a message queue: 'user.followed', 'post.liked', 'comment.added'. (2) Notification Service reads events, looks up user preferences (do they want push? email? SMS?), applies business rules (don't notify if user is online, respect quiet hours). (3) Workers dispatch to: Push (Firebase FCM, Apple APNS), Email (SendGrid, SES), SMS (Twilio). (4) Track delivery status. Key considerations: fan-out (one like can notify millions of followers — use a separate fan-out worker), rate limiting notifications per user (don't send 1,000 emails/hour), aggregation ('5 people liked your post' not 5 separate notifications), and user timezone respect for SMS/email timing.",
    difficulty: "intermediate",
    tags: ["notifications", "push", "email", "message-queue", "fan-out"],
    followUps: [
      "How do you handle fan-out for a celebrity with 50M followers?",
      "How would you batch-aggregate notifications?",
    ],
  },
  {
    id: "sd-q-10",
    tech: "system-design",
    question: "What is the difference between SQL and NoSQL databases? How do you choose?",
    shortAnswer:
      "SQL: structured schema, ACID transactions, great for relations and complex queries. NoSQL: flexible schema, horizontal scale, eventual consistency. Choose based on access patterns, consistency requirements, and scale — not hype.",
    answer:
      "SQL databases (PostgreSQL, MySQL) use structured tables with schemas, support ACID transactions, and enable complex JOINs and queries. Best for: financial data, user accounts, content with clear relationships, reporting. NoSQL comes in several types: Document (MongoDB — flexible JSON, good for rapidly evolving schemas), Wide-Column (Cassandra — write-heavy time-series, massive scale), Key-Value (Redis — caching, sessions), Graph (Neo4j — social connections). The decision framework: (1) What are the access patterns? Simple lookups by ID → NoSQL. Complex multi-table joins → SQL. (2) What consistency level do you need? Money → SQL ACID. Social feed → eventual consistency NoSQL. (3) What's the write volume? 10K writes/sec is fine for Postgres. 1M writes/sec → Cassandra. In practice: use PostgreSQL as default, add specialized stores as needed.",
    difficulty: "intermediate",
    tags: ["sql", "nosql", "databases", "postgresql", "cassandra", "mongodb"],
    followUps: [
      "What is polyglot persistence?",
      "When would you use a graph database?",
    ],
  },
  {
    id: "sd-q-11",
    tech: "system-design",
    question: "How do you approach a system design interview?",
    shortAnswer:
      "Follow 5 steps: (1) Clarify requirements, (2) Capacity estimation, (3) API design, (4) Data model + DB choice, (5) High-level architecture then deep-dive on hard parts. Communicate while drawing. Ask before assuming.",
    answer:
      "Step 1: Clarify requirements (5 min) — ask about scale (users, QPS, data size), functional requirements, non-functional (availability, latency, consistency). Never assume. Step 2: Capacity estimation (5 min) — back-of-envelope: storage, throughput, bandwidth. This informs all design decisions. Step 3: API design (3 min) — define endpoints, inputs/outputs, HTTP methods. Step 4: Database design (5 min) — schema, SQL vs NoSQL choice, indexing. Step 5: Architecture (20 min) — draw the boxes: client → CDN → LB → API servers → cache → DB. Then zoom into the hardest component. Always discuss: caching, load balancing, failure scenarios, bottlenecks. Red flags: jumping to architecture before requirements, not estimating scale, ignoring the cache, saying 'NoSQL is faster' without justification.",
    difficulty: "beginner",
    tags: ["interview", "system-design", "framework", "approach"],
    followUps: [
      "How do you handle running out of time in an interview?",
      "What should you do if you don't know the answer?",
    ],
  },
  {
    id: "sd-q-12",
    tech: "system-design",
    question: "What is the difference between synchronous and asynchronous communication between services?",
    shortAnswer:
      "Synchronous: caller waits for response (REST, gRPC). Tight coupling, simple, but caller is blocked and a downstream failure can cascade. Asynchronous: caller publishes a message and continues (message queues). Decoupled, resilient, but harder to debug and introduces eventual consistency.",
    answer:
      "Synchronous communication (REST APIs, gRPC) means the caller sends a request and blocks waiting for the response. Simple and easy to reason about, but: (1) caller is blocked — slow downstream = slow response, (2) cascading failures — if Service B is down, Service A's requests fail, (3) tight coupling — A must know B's address. Asynchronous communication (message queues, pub/sub) means the caller publishes a message to a queue and immediately continues. Consumers process when ready. Benefits: (1) callers aren't blocked, (2) resilient — queue absorbs failures, (3) decoupled — producer doesn't know consumers. Costs: (1) eventual consistency — result isn't immediate, (2) harder to debug (trace across services), (3) more infrastructure. Use sync for: user-facing requests needing immediate response. Use async for: background jobs, notifications, cross-service workflows.",
    difficulty: "intermediate",
    tags: ["sync", "async", "microservices", "message-queues", "rest", "grpc"],
    followUps: [
      "What is the saga pattern for distributed transactions?",
      "How do you implement request tracing across async services?",
    ],
  },
]

export default questions
