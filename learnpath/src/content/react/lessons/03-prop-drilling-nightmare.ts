import type { Lesson } from "@/lib/types"

const lesson: Lesson = {
  id: "react-03-prop-drilling",
  tech: "react",
  pathId: "beginner",
  order: 3,
  title: "The Prop Drilling Nightmare",
  storyTitle: "The Theme Switch That Broke Everything",
  storyContext: `It's been two weeks. You're now trusted with bigger features.

📩 **Sarah (PM):** "Users are asking for a dark/light mode toggle. Should be easy right? Just a switch in the header?"

📩 **Jake:** "Famous last words 😅 — our component tree is like 6 levels deep. The theme state needs to reach the buttons inside the cards inside the grid inside the layout inside the dashboard. Good luck."

You start passing the \`theme\` prop down from \`App\` → \`Dashboard\` → \`Sidebar\` → \`NavItem\` → \`Icon\`. Then you realize every single intermediate component now has a prop it doesn't even use — it just passes it down. Your PR has 47 files changed and nobody's happy.

Jake sends you a link: "Read about Context."`,
  concept: "useContext",
  challenge:
    "The theme value is being prop-drilled through 4 components that don't need it. Refactor to use React Context so any component can access the theme without passing props.",
  starterCode: `import React, { useState } from 'react';

// ❌ Prop drilling — every component passes theme down even if it doesn't use it
function App() {
  const [theme, setTheme] = useState('dark');
  return <Dashboard theme={theme} setTheme={setTheme} />;
}

function Dashboard({ theme, setTheme }) {
  // Dashboard doesn't use theme — just passes it
  return <Sidebar theme={theme} setTheme={setTheme} />;
}

function Sidebar({ theme, setTheme }) {
  // Sidebar doesn't use theme — just passes it
  return <ThemeToggle theme={theme} setTheme={setTheme} />;
}

function ThemeToggle({ theme, setTheme }) {
  // This is the only component that actually needs it
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Current: {theme}
    </button>
  );
}`,
  solution: `import React, { useState, useContext, createContext } from 'react';

// ✅ Step 1: Create a context
const ThemeContext = createContext({ theme: 'dark', setTheme: () => {} });

// ✅ Step 2: Provide it at the top level
function App() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Dashboard />
    </ThemeContext.Provider>
  );
}

// ✅ No more passing props through middle components
function Dashboard() {
  return <Sidebar />;
}

function Sidebar() {
  return <ThemeToggle />;
}

// ✅ Step 3: Consume directly where needed
function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Current: {theme}
    </button>
  );
}`,
  explanation: `**What is prop drilling?**
Passing props through components that don't use them — just to get the value to a deeply nested component. It creates tight coupling and makes refactoring painful.

**Context = a global channel:**
Think of Context like a radio station. You broadcast a signal (\`Provider\`), and any component anywhere in the tree can tune in (\`useContext\`) — no matter how deep they are.

**The three steps:**
\`\`\`js
// 1. Create the channel
const ThemeContext = createContext(defaultValue)

// 2. Broadcast on the channel (wrap components that need access)
<ThemeContext.Provider value={theme}>
  <App />
</ThemeContext.Provider>

// 3. Tune in anywhere
const theme = useContext(ThemeContext)
\`\`\`

**When to use Context vs props:**
- Props: when 1-2 levels deep, or when the prop is specific to the child
- Context: when multiple unrelated components need the same value, or when passing through 3+ levels`,
  takeaway:
    "Context broadcasts a value to any descendant without prop drilling — use it for theme, auth, language, and other app-wide state.",
  tags: ["useContext", "context", "prop-drilling", "hooks", "state-management"],
  estimatedMinutes: 18,
}

export default lesson
