import type { Lesson } from "@/lib/types"

const lesson: Lesson = {
  id: "react-00e-lists-keys",
  tech: "react",
  pathId: "beginner",
  order: 4,
  title: "The Flickering User Table",
  storyTitle: "Console Warning Pileup",
  storyContext: `Week two, Friday afternoon. Jake does a quick code review of your PR.

📩 **Jake:** "Hey, your PR looks mostly good but you've got like 800 React warnings in the console. Have a look."

You open DevTools. It's wall-to-wall red:

\`Warning: Each child in a list should have a unique "key" prop.\`

📩 **You:** "I've seen this warning before but always ignored it. Does it actually matter?"

📩 **Jake:** "Big time. Open the user table, sort it by email, and watch what happens to the checkboxes."

You try it. The checkboxes move to the wrong rows. A user you checked is now unchecked. A different user is checked instead.

📩 **Jake:** "That's React losing track of which row is which. It's comparing elements by position — not by identity. Keys fix that. Without them, React can't tell 'this row moved' from 'this row was replaced'. It just guesses — and it guesses wrong."`,
  concept: "Lists & Keys",
  challenge:
    "This table renders without keys, causing React to lose track of rows when the list re-orders. Add proper keys using the user's unique `id`. Also fix the `.map()` return so items actually render.",
  starterCode: `import React, { useState } from 'react';

const initialUsers = [
  { id: 'u1', name: 'Alice Chen',   email: 'alice@acme.com',  role: 'Admin' },
  { id: 'u2', name: 'Bob Martinez', email: 'bob@acme.com',    role: 'Editor' },
  { id: 'u3', name: 'Carol White',  email: 'carol@acme.com',  role: 'Viewer' },
];

function UserTable() {
  const [users, setUsers] = useState(initialUsers);
  const [checked, setChecked] = useState({});

  function sortByEmail() {
    setUsers([...users].sort((a, b) => a.email.localeCompare(b.email)));
  }

  function toggleCheck(id) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div>
      <button onClick={sortByEmail}>Sort by email</button>
      <table>
        <tbody>
          {/* ❌ Bug 1: No key prop — React loses track of rows on re-order */}
          {/* ❌ Bug 2: Arrow function body needs a return or remove the {} */}
          {users.map((user) => {
            <tr>
              <td>
                <input
                  type="checkbox"
                  checked={!!checked[user.id]}
                  onChange={() => toggleCheck(user.id)}
                />
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
  );
}`,
  solution: `import React, { useState } from 'react';

const initialUsers = [
  { id: 'u1', name: 'Alice Chen',   email: 'alice@acme.com',  role: 'Admin' },
  { id: 'u2', name: 'Bob Martinez', email: 'bob@acme.com',    role: 'Editor' },
  { id: 'u3', name: 'Carol White',  email: 'carol@acme.com',  role: 'Viewer' },
];

function UserTable() {
  const [users, setUsers] = useState(initialUsers);
  const [checked, setChecked] = useState({});

  function sortByEmail() {
    setUsers([...users].sort((a, b) => a.email.localeCompare(b.email)));
  }

  function toggleCheck(id) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div>
      <button onClick={sortByEmail}>Sort by email</button>
      <table>
        <tbody>
          {/* ✅ key={user.id} — stable, unique ID from the data */}
          {/* ✅ Parentheses instead of braces = implicit return */}
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <input
                  type="checkbox"
                  checked={!!checked[user.id]}
                  onChange={() => toggleCheck(user.id)}
                />
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`,
  explanation: `**Why keys matter — React's reconciliation problem:**

When a list re-renders, React needs to know which old element matches which new element. Without keys, React matches by *position*:
- Position 0 old → Position 0 new
- Position 1 old → Position 1 new

If you sort the list, position 0 now holds a different user — but React thinks it's the same one. It updates the text but keeps the old DOM state (like a checked checkbox). The result: wrong checkboxes, wrong focused inputs, wrong animations.

**With keys, React matches by identity:**
\`key="u1"\` always maps to the "Alice" row, regardless of its position. When the list sorts, React moves the whole DOM node — including its state.

**Good keys vs bad keys:**

\`\`\`js
// ✅ Use a stable unique ID from your data
users.map(user => <Row key={user.id} />)

// ✅ Use a stable string if there's no id
items.map(item => <Row key={item.slug} />)

// ❌ Never use array index — breaks on sort/delete
users.map((user, index) => <Row key={index} />)

// ❌ Never use Math.random() — generates new key every render
users.map(user => <Row key={Math.random()} />)
\`\`\`

**The map() return gotcha:**
\`{} \` in an arrow function = function body (needs explicit \`return\`).
\`()\` = implicit return. For JSX in \`.map()\`, always use \`()\`.`,
  takeaway:
    "Keys let React track list items by identity, not position — always use a stable unique ID from your data, never the array index.",
  tags: ["lists", "keys", "map", "reconciliation", "fundamentals"],
  estimatedMinutes: 14,
}

export default lesson
