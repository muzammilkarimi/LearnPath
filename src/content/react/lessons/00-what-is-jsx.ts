import type { Lesson } from "@/lib/types"

const lesson: Lesson = {
  id: "react-00-what-is-jsx",
  tech: "react",
  pathId: "beginner",
  order: 0,
  title: "What Is This HTML Doing in My JavaScript?",
  storyTitle: "Orientation Day at Acme Corp",
  storyContext: `It's your very first hour at Acme Corp. You've been given access to the codebase and you open your first React file.

📩 **Jake (Senior Dev):** "Welcome aboard! I sent you access to the repo. Have a look around and let me know if anything looks weird."

You open \`Header.jsx\` and immediately freeze. There's HTML sitting inside a JavaScript function. No quotes around it. No string. Just... HTML. Raw. Right there.

\`\`\`js
function Header() {
  return <h1>Welcome to Acme</h1>;
}
\`\`\`

📩 **You → Jake:** "Uh... is there HTML inside this JavaScript function? Is that valid?"

📩 **Jake:** "Ha, yeah — that's JSX. Not actual HTML. It looks like HTML but it gets compiled to JavaScript before the browser ever sees it. React's whole thing. Give me 10 mins and I'll explain it properly."

Jake explains JSX is syntactic sugar that compiles to \`React.createElement()\` calls. The browser never sees the JSX — only the compiled JS.`,
  concept: "JSX",
  challenge:
    "Fix the JSX syntax errors in this component. JSX looks like HTML but has key differences: use `className` not `class`, wrap multiple elements in a single parent, and expressions go inside `{}`.",
  starterCode: `function WelcomeBanner({ username }) {
  const isLoggedIn = true;

  // ❌ Fix the 4 JSX errors below:
  return (
    // Error 1: JSX must have ONE root element — wrap these in a <div> or <>
    <h1 class="banner-title">Welcome back!</h1>
    <p>Hello, {username}</p>

    // Error 2: 'class' is a reserved word in JS — use 'className'
    // Error 3: To show JS values in JSX, use {} not quotes
    // Error 4: There are two root elements above — JSX needs one parent
  );
}`,
  solution: `function WelcomeBanner({ username }) {
  const isLoggedIn = true;

  // ✅ All JSX rules followed:
  return (
    // 1. Single root element (fragment <> or a div)
    <>
      {/* 2. className, not class */}
      <h1 className="banner-title">Welcome back!</h1>

      {/* 3. JS expressions go inside {} */}
      <p>Hello, {username}</p>

      {/* 4. Conditional rendering with && */}
      {isLoggedIn && <span className="badge">Online</span>}
    </>
  );
}`,
  explanation: `**JSX is not HTML — it's JavaScript in disguise.**

Your browser never sees JSX. Before it runs, a compiler (Babel/SWC) transforms it into plain JavaScript:

\`\`\`js
// What you write:
<h1 className="title">Hello</h1>

// What the compiler produces:
React.createElement("h1", { className: "title" }, "Hello")
\`\`\`

**The 4 JSX rules you must know:**

| Rule | HTML | JSX |
|---|---|---|
| CSS class | \`class="btn"\` | \`className="btn"\` |
| Root element | Multiple roots OK | Must have ONE parent |
| JS values | N/A | Use \`{expression}\` |
| Comments | \`<!-- -->\` | \`{/* */}\` |

**Why \`className\` instead of \`class\`?**
Because \`class\` is a reserved keyword in JavaScript (for ES6 classes). JSX compiles to JS, so it has to use \`className\` to avoid conflicts.

**The fragment trick \`<></>\`:**
When you need a single parent but don't want an extra \`<div>\` in the DOM, use an empty fragment \`<></>\`. It wraps without adding a real element.`,
  takeaway:
    "JSX is compiled JavaScript — not HTML. It follows JS rules: className not class, one root element, and {} for any expression.",
  tags: ["jsx", "fundamentals", "syntax", "components"],
  estimatedMinutes: 10,
}

export default lesson
