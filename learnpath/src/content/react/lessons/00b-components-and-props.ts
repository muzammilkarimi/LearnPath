import type { Lesson } from "@/lib/types"

const lesson: Lesson = {
  id: "react-00b-components-props",
  tech: "react",
  pathId: "beginner",
  order: 1,
  title: "The Copy-Paste Crisis",
  storyTitle: "300 Lines of the Same Button",
  storyContext: `End of week one. Jake asks you to add a new button to the admin panel.

You open \`AdminPanel.jsx\` and find this — literally copied and pasted 8 times with minor text changes:

\`\`\`jsx
<button style={{ backgroundColor: '#00d992', color: '#101010', padding: '10px 16px', borderRadius: '6px' }}>
  Approve User
</button>

<button style={{ backgroundColor: '#00d992', color: '#101010', padding: '10px 16px', borderRadius: '6px' }}>
  Delete Record
</button>

<button style={{ backgroundColor: '#00d992', color: '#101010', padding: '10px 16px', borderRadius: '6px' }}>
  Export CSV
</button>
\`\`\`

📩 **Jake:** "Oh no. Who wrote this 😭 If we ever want to change the button style, we'd have to update it in 8 places. This is what components and props are for. Can you refactor it?"

📩 **You:** "So... I make one Button component and pass the label as a prop?"

📩 **Jake:** "Exactly. Components are functions. Props are the arguments. Go for it."`,
  concept: "Components & Props",
  challenge:
    "Extract the repeated button into a reusable `Button` component. It should accept a `label` prop (the text) and an optional `variant` prop for different styles. Then use it to replace the 3 copies.",
  starterCode: `// ❌ Three copies of the same button — maintenance nightmare
function AdminPanel() {
  return (
    <div>
      <button style={{ backgroundColor: '#00d992', color: '#101010', padding: '10px 16px', borderRadius: '6px' }}>
        Approve User
      </button>
      <button style={{ backgroundColor: '#e74c3c', color: 'white', padding: '10px 16px', borderRadius: '6px' }}>
        Delete Record
      </button>
      <button style={{ backgroundColor: '#00d992', color: '#101010', padding: '10px 16px', borderRadius: '6px' }}>
        Export CSV
      </button>
    </div>
  );
}`,
  solution: `// ✅ One component, used three times with different props
function Button({ label, variant = 'primary' }) {
  const styles = {
    primary: { backgroundColor: '#00d992', color: '#101010' },
    danger:  { backgroundColor: '#e74c3c', color: 'white' },
  };

  return (
    <button style={{ ...styles[variant], padding: '10px 16px', borderRadius: '6px' }}>
      {label}
    </button>
  );
}

function AdminPanel() {
  return (
    <div>
      <Button label="Approve User" />
      <Button label="Delete Record" variant="danger" />
      <Button label="Export CSV" />
    </div>
  );
}`,
  explanation: `**Components are just functions that return JSX.**

\`\`\`js
// A component is a function...
function Button({ label }) {
  return <button>{label}</button>;
}

// ...that you use like an HTML tag
<Button label="Click me" />
\`\`\`

**Props are the function's arguments.**

When you write \`<Button label="Click me" />\`, React calls your function with \`{ label: "Click me" }\` as the argument. You destructure them in the function signature:

\`\`\`js
function Button({ label, variant = 'primary' }) {
//               ↑ destructured    ↑ default value
}
\`\`\`

**Three things props let you do:**
1. **Pass data down** — parent controls what the child shows
2. **Customize behavior** — same component, different variants
3. **Compose UI** — small reusable pieces that combine into complex UIs

**The one rule of props: they are read-only.**
A component can never modify the props it receives. Props flow one direction — parent to child. To send data back up, you pass a *function* as a prop (callback).`,
  takeaway:
    "Components are functions, props are their arguments — when you find yourself copy-pasting UI, that's the signal to extract a component.",
  tags: ["components", "props", "reusability", "fundamentals"],
  estimatedMinutes: 12,
}

export default lesson
