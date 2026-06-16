import type { Lesson } from "@/lib/types"

const lesson: Lesson = {
  id: "react-04-slow-list",
  tech: "react",
  pathId: "beginner",
  order: 4,
  title: "The Slow List",
  storyTitle: "The Performance Ticket",
  storyContext: `Three weeks in. You're getting comfortable. Then the performance report lands.

📩 **Sarah (PM):** "Our product analytics show users are abandoning the search page after 3 seconds. The search input feels laggy. Can you investigate?"

You open Chrome DevTools and profile the search component. Every single keystroke re-renders a list of 500 products — and each product runs an expensive price calculation. A search for "laptop" means 5 keystrokes × 500 calculations = 2,500 unnecessary calculations just for typing.

📩 **Jake:** "Check useMemo. The calculation result should be cached, not recomputed on every render."

This is your first real performance optimization task.`,
  concept: "useMemo",
  challenge:
    "The product list re-calculates discounted prices on every keystroke. Use useMemo to cache the expensive calculation and only recompute when the products list changes.",
  starterCode: `import React, { useState } from 'react';

// Simulates an expensive calculation (e.g., applying complex pricing rules)
function calculateDiscountedPrice(price) {
  // Imagine this takes real time
  let result = price;
  for (let i = 0; i < 10000; i++) {
    result = result * 0.9 + 0.1;
  }
  return Math.round(result * 100) / 100;
}

export default function ProductSearch({ products }) {
  const [query, setQuery] = useState('');

  // ❌ This runs on EVERY render — including every keystroke
  const discountedProducts = products.map((p) => ({
    ...p,
    finalPrice: calculateDiscountedPrice(p.price),
  }));

  const filtered = discountedProducts.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
      />
      {filtered.map((p) => (
        <div key={p.id}>{p.name} — \${p.finalPrice}</div>
      ))}
    </div>
  );
}`,
  solution: `import React, { useState, useMemo } from 'react';

function calculateDiscountedPrice(price) {
  let result = price;
  for (let i = 0; i < 10000; i++) {
    result = result * 0.9 + 0.1;
  }
  return Math.round(result * 100) / 100;
}

export default function ProductSearch({ products }) {
  const [query, setQuery] = useState('');

  // ✅ Only recalculates when 'products' changes — not on every keystroke
  const discountedProducts = useMemo(
    () =>
      products.map((p) => ({
        ...p,
        finalPrice: calculateDiscountedPrice(p.price),
      })),
    [products] // dependency: only re-run if products array changes
  );

  // Filtering is cheap, no memoization needed
  const filtered = discountedProducts.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
      />
      {filtered.map((p) => (
        <div key={p.id}>{p.name} — \${p.finalPrice}</div>
      ))}
    </div>
  );
}`,
  explanation: `**What useMemo does:**
\`useMemo\` caches the *result* of a function call and only recomputes it when its dependencies change.

\`\`\`js
const result = useMemo(() => expensiveComputation(a, b), [a, b])
//                      ↑ the function       ↑ dep array
\`\`\`

**The key insight — two separate operations:**
1. **Price calculation** → depends on \`products\`. Products don't change when you type. Cache this.
2. **Filtering** → depends on \`query\`. This is cheap (just string matching). No caching needed.

**When to use useMemo:**
- The computation is genuinely slow (measured, not assumed)
- The dependencies change less often than the component renders
- You've confirmed the slowness with DevTools profiling

**When NOT to use useMemo:**
- Don't add it everywhere "just in case" — it adds overhead
- Premature optimization is the root of all evil. Profile first.`,
  takeaway:
    "useMemo caches expensive computed values — only use it when you've measured a real performance problem, not as a habit.",
  tags: ["useMemo", "performance", "memoization", "hooks", "optimization"],
  estimatedMinutes: 16,
}

export default lesson
