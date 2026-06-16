import type { Lesson } from "@/lib/types"

const lesson: Lesson = {
  id: "react-00c-event-handling",
  tech: "react",
  pathId: "beginner",
  order: 2,
  title: "The Unresponsive Delete Button",
  storyTitle: "Support Ticket #217",
  storyContext: `Week two. A support ticket lands in your queue.

📩 **Support ticket #217:**
"The Delete button in the user management table does absolutely nothing when I click it. I've tried Chrome, Firefox, and Edge. Nothing happens. No error, no confirmation, nothing."

📩 **Sarah (PM):** "This is blocking our ops team. They have to manually run SQL to delete users. Can you look at it today?"

You open the component. The button is there. The \`handleDelete\` function is defined. But something's wrong with how the event handler is attached.

\`\`\`jsx
<button onClick={handleDelete(user.id)}>Delete</button>
\`\`\`

You stare at it. Then you see it.

📩 **You → Jake:** "The onClick is calling the function immediately instead of passing it as a handler, right?"

📩 **Jake:** "Bingo. Classic mistake. The \`()\` calls it on render. You want to pass a reference or wrap it in an arrow function."`,
  concept: "Event Handling",
  challenge:
    "The delete button calls `handleDelete(user.id)` immediately on render instead of waiting for a click. Fix the event handler syntax. Also fix the form's submit handler to prevent page reload.",
  starterCode: `import React from 'react';

function UserTable({ users }) {
  function handleDelete(userId) {
    console.log('Deleting user:', userId);
    // API call would go here
  }

  function handleSearch(event) {
    console.log('Searching for:', event.target.value);
  }

  function handleFormSubmit(event) {
    // We want to handle this ourselves, not reload the page
    console.log('Form submitted!');
  }

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        {/* ❌ Bug 1: This will reload the page on submit */}
        <input onChange={handleSearch} placeholder="Search users" />
        <button type="submit">Search</button>
      </form>

      {users.map((user) => (
        <div key={user.id}>
          <span>{user.name}</span>

          {/* ❌ Bug 2: This calls handleDelete immediately on render, not on click */}
          <button onClick={handleDelete(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}`,
  solution: `import React from 'react';

function UserTable({ users }) {
  function handleDelete(userId) {
    console.log('Deleting user:', userId);
  }

  function handleSearch(event) {
    // event.target.value gives you the input's current value
    console.log('Searching for:', event.target.value);
  }

  function handleFormSubmit(event) {
    // ✅ Prevent the default browser behavior (page reload)
    event.preventDefault();
    console.log('Form submitted!');
  }

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <input onChange={handleSearch} placeholder="Search users" />
        <button type="submit">Search</button>
      </form>

      {users.map((user) => (
        <div key={user.id}>
          <span>{user.name}</span>

          {/* ✅ Arrow function wraps the call — only runs on click */}
          <button onClick={() => handleDelete(user.id)}>Delete</button>

          {/* Also valid: bind */}
          {/* <button onClick={handleDelete.bind(null, user.id)}>Delete</button> */}
        </div>
      ))}
    </div>
  );
}`,
  explanation: `**The most common event handler mistake in React:**

\`\`\`js
// ❌ WRONG — calls handleDelete immediately, passes its return value as the handler
<button onClick={handleDelete(user.id)}>

// ✅ CORRECT — passes a function reference that React calls on click
<button onClick={() => handleDelete(user.id)}>
\`\`\`

Think of \`onClick\` as expecting a *function to call later*, not a *value to set now*.

**The event object:**
React passes a synthetic event object to every handler:
\`\`\`js
function handleChange(event) {
  event.target.value    // input's current value
  event.target.checked  // checkbox state
  event.preventDefault() // stop default browser behavior
  event.stopPropagation() // stop event bubbling up
}
\`\`\`

**Common events you'll use every day:**
| Event | Use |
|---|---|
| \`onClick\` | Buttons, divs, any clickable |
| \`onChange\` | Inputs, selects, checkboxes |
| \`onSubmit\` | Form submission |
| \`onFocus\` / \`onBlur\` | Input focus/blur |
| \`onKeyDown\` | Keyboard shortcuts |`,
  takeaway:
    "`onClick={fn}` passes a reference — `onClick={fn()}` calls it immediately. Always pass a reference or wrap in an arrow function when you need arguments.",
  tags: ["events", "onClick", "onChange", "onSubmit", "event-handling", "fundamentals"],
  estimatedMinutes: 12,
}

export default lesson
