import type { Lesson } from "@/lib/types"

const lesson: Lesson = {
  id: "react-01-dashboard-crisis",
  tech: "react",
  pathId: "beginner",
  order: 1,
  title: "The Dashboard Crisis",
  storyTitle: "Day 1 at Acme Corp",
  storyContext: `You just joined Acme Corp as a junior frontend developer. It's 9:02 AM on your first day and your Slack is already blowing up.

📩 **Sarah (PM):** "Hey! Welcome aboard. Quick thing — the user counter on our dashboard is totally broken. It just shows '0' no matter what. The CEO is presenting this to investors in 2 hours. Can you fix it?"

📩 **Jake (Senior Dev):** "Hey new person 👋 I pushed a component yesterday but didn't wire up the state correctly. Check \`UserCounter.jsx\`. Should be a quick fix — just needs useState."

You open the file and see a component that declares a variable but never makes it reactive. Time to save the day.`,
  concept: "useState",
  challenge:
    "The UserCounter component uses a plain variable for the count. Users click the button but nothing updates. Fix it using useState to make the count reactive.",
  starterCode: `import React from 'react';

// ❌ This doesn't work — plain variables don't trigger re-renders
export default function UserCounter() {
  let count = 0;

  function handleClick() {
    count = count + 1;
    console.log('Count is now:', count); // This works...
    // ...but the UI never updates. Why?
  }

  return (
    <div className="counter">
      <h2>Active Users</h2>
      <p className="count">{count}</p>
      <button onClick={handleClick}>
        + Add User
      </button>
    </div>
  );
}`,
  solution: `import React, { useState } from 'react';

// ✅ useState tells React: "when this value changes, re-render"
export default function UserCounter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    // React now knows to re-render this component
  }

  return (
    <div className="counter">
      <h2>Active Users</h2>
      <p className="count">{count}</p>
      <button onClick={handleClick}>
        + Add User
      </button>
    </div>
  );
}`,
  explanation: `**Why plain variables don't work:**
React only re-renders a component when it detects a state change. A plain \`let\` variable lives in the function's local scope — when the function re-runs (re-renders), it resets to 0. React has no idea the variable changed, so it never re-renders.

**What useState actually does:**
\`useState(0)\` does two things:
1. Stores the value *outside* the function in React's internal memory
2. Returns a *setter* function that tells React "something changed, re-render this"

**The pattern:**
\`\`\`js
const [value, setValue] = useState(initialValue)
//     ↑ current   ↑ setter    ↑ starting value
\`\`\`

Every time \`setValue\` is called, React schedules a re-render and the component runs again — but this time \`value\` returns the new number, not the initial one.`,
  takeaway:
    "useState makes values persistent and reactive — plain variables reset on every render and are invisible to React.",
  tags: ["useState", "state", "re-render", "hooks"],
  estimatedMinutes: 12,
}

export default lesson
