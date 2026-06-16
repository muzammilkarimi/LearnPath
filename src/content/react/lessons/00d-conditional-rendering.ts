import type { Lesson } from "@/lib/types"

const lesson: Lesson = {
  id: "react-00d-conditional-rendering",
  tech: "react",
  pathId: "beginner",
  order: 3,
  title: "The Dashboard That Shows Everything at Once",
  storyTitle: "The Loading State Disaster",
  storyContext: `Week two, Thursday. Your monitoring alert fires at 7 AM.

📩 **Sentry alert:** "TypeError: Cannot read properties of undefined (reading 'name') — UserDashboard.jsx:12"

📩 **3 users on Twitter:** "Your dashboard is broken, just shows 'undefined undefined undefined' everywhere"

You pull up the component. The data fetches from an API — but the component renders immediately, before the data arrives. It tries to access \`user.name\` when \`user\` is still \`null\`. JavaScript throws. The page crashes.

📩 **Jake:** "Classic async render bug. You need conditional rendering — show a loading state until the data is ready, show an error state if the fetch fails, and only render the real UI when you actually have data."

📩 **Jake:** "Think about it as three possible states: loading, error, or success. Your component needs to handle all three."`,
  concept: "Conditional Rendering",
  challenge:
    "The dashboard crashes because it tries to render `user.name` before data loads. Add conditional rendering to handle three states: loading spinner, error message, and the real content once data arrives.",
  starterCode: `import React, { useState, useEffect } from 'react';

function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => { setUser(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [userId]);

  // ❌ Renders immediately without checking if data exists
  // Crashes when user is null, loading is true, or fetch failed
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <p>Member since: {user.createdAt}</p>
    </div>
  );
}`,
  solution: `import React, { useState, useEffect } from 'react';

function UserDashboard({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => { setUser(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [userId]);

  // ✅ Handle all three states: loading, error, success
  if (loading) {
    return <div className="spinner">Loading...</div>;
  }

  if (error) {
    return <div className="error">Failed to load user: {error}</div>;
  }

  // By here, user is guaranteed to exist
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <p>Member since: {user.createdAt}</p>

      {/* Inline conditional: only show badge if user is an admin */}
      {user.isAdmin && <span className="badge">Admin</span>}

      {/* Ternary: show different text based on status */}
      <p>{user.isActive ? 'Active account' : 'Account suspended'}</p>
    </div>
  );
}`,
  explanation: `**Your component runs before data arrives — always.**

React renders synchronously. When the component first runs, \`user\` is \`null\`. If you try to access \`null.name\`, JavaScript throws. Conditional rendering guards against this.

**Three patterns for conditional rendering:**

\`\`\`jsx
// 1. Early return — best for loading/error states
if (loading) return <Spinner />;
if (error) return <Error message={error} />;
return <RealContent />;

// 2. && operator — renders only if truthy
{user.isAdmin && <AdminBadge />}
// If isAdmin is false/null/undefined, renders nothing
// ⚠️ Watch out: {0 && <X />} renders "0", not nothing

// 3. Ternary — renders one of two options
{user.isActive ? <ActiveBadge /> : <SuspendedBadge />}
\`\`\`

**Think in states, not in time:**
Every component can be in one of several states at any moment. Map them out before you write code:
- Loading state → spinner/skeleton
- Error state → error message with retry option
- Empty state → "no data" message
- Success state → the actual content

If you handle all states, you never crash.`,
  takeaway:
    "Components render before data arrives — always guard with loading/error checks before accessing data that might be null or undefined.",
  tags: ["conditional-rendering", "loading-state", "error-state", "fundamentals", "&&", "ternary"],
  estimatedMinutes: 13,
}

export default lesson
