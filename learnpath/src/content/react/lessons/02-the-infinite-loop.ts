import type { Lesson } from "@/lib/types"

const lesson: Lesson = {
  id: "react-02-infinite-loop",
  tech: "react",
  pathId: "beginner",
  order: 2,
  title: "The Infinite Loop",
  storyTitle: "Production is Down",
  storyContext: `It's Thursday afternoon. Jake messages you in a panic.

📩 **Jake:** "URGENT — the user profile page is crashing Chrome tabs. Users are reporting the page freezes and they have to force-quit the browser. Sentry is showing thousands of errors per minute."

📩 **Jake:** "I added a feature to fetch the user's data from the API when the component loads. Seemed simple. Now everything is on fire."

📩 **Sarah (PM):** "Engineering, we have 50 users complaining right now. This needs to go down in 10 minutes or we're rolling back the whole deploy."

You pull up Jake's code and immediately see the problem — a useEffect with a missing dependency array that's calling setState, which triggers a re-render, which triggers the effect again... infinitely.`,
  concept: "useEffect",
  challenge:
    "The component is stuck in an infinite loop: useEffect calls setUser, which re-renders the component, which triggers useEffect again. Fix it by adding the correct dependency array.",
  starterCode: `import React, { useState, useEffect } from 'react';

async function fetchUser(id) {
  const res = await fetch(\`/api/users/\${id}\`);
  return res.json();
}

export default function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ❌ No dependency array = runs after EVERY render
  // setUser causes a render → useEffect runs again → infinite loop
  useEffect(() => {
    setLoading(true);
    fetchUser(userId).then((data) => {
      setUser(data);
      setLoading(false);
    });
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>{user?.name}</h1>
      <p>{user?.email}</p>
    </div>
  );
}`,
  solution: `import React, { useState, useEffect } from 'react';

async function fetchUser(id) {
  const res = await fetch(\`/api/users/\${id}\`);
  return res.json();
}

export default function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ [userId] = "only run this effect when userId changes"
  useEffect(() => {
    setLoading(true);
    fetchUser(userId).then((data) => {
      setUser(data);
      setLoading(false);
    });
  }, [userId]); // ← the dependency array

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>{user?.name}</h1>
      <p>{user?.email}</p>
    </div>
  );
}`,
  explanation: `**The three forms of useEffect:**

\`\`\`js
useEffect(() => { ... })          // runs after EVERY render (almost never what you want)
useEffect(() => { ... }, [])      // runs ONCE after the first render (mount)
useEffect(() => { ... }, [id])    // runs when 'id' changes
\`\`\`

**Why the loop happened:**
1. Component renders → useEffect runs (no dep array = always runs)
2. fetchUser resolves → setUser called
3. setUser triggers re-render
4. Re-render → useEffect runs again → goto 2

**The fix:**
\`[userId]\` tells React: "I only care about fetching when \`userId\` changes." Now the effect only fires when \`userId\` prop actually changes — not on every re-render.

**Mental model:** The dependency array is a list of *reasons* to re-run the effect. No deps = no reasons = run every time. Empty array = no reasons = run once. \`[userId]\` = run when userId changes.`,
  takeaway:
    "useEffect without a dependency array runs after every render — almost always a bug. Always ask: when should this run?",
  tags: ["useEffect", "dependencies", "infinite-loop", "hooks", "side-effects"],
  estimatedMinutes: 15,
}

export default lesson
