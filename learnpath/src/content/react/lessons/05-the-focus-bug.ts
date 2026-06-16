import type { Lesson } from "@/lib/types"

const lesson: Lesson = {
  id: "react-05-focus-bug",
  tech: "react",
  pathId: "beginner",
  order: 5,
  title: "The Focus Bug",
  storyTitle: "Accessibility Complaint",
  storyContext: `Month 2. You're now the go-to person for tricky React bugs.

📩 **Support ticket #4821:** "Your search bar doesn't auto-focus when I open the search modal. I have to click on it manually every time. This is really annoying for keyboard-only users."

📩 **Jake:** "Accessibility bug. The modal opens but the input doesn't get focus. We can't use \`document.getElementById('search').focus()\` — that's not the React way. You need useRef."

You've heard of refs before but never used one. A ref is React's escape hatch to interact with real DOM elements directly — things like focus, scroll, animations, and third-party libraries that need a DOM node.`,
  concept: "useRef",
  challenge:
    "The search modal opens but the input doesn't auto-focus, forcing users to click manually. Use useRef to grab the input element and call .focus() when the modal opens.",
  starterCode: `import React, { useState, useEffect } from 'react';

export default function SearchModal({ isOpen }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      // ❌ This is the "vanilla JS" way — bypasses React
      // Also fragile: what if the id changes?
      const input = document.getElementById('search-input');
      if (input) input.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal">
      <input
        id="search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
    </div>
  );
}`,
  solution: `import React, { useState, useEffect, useRef } from 'react';

export default function SearchModal({ isOpen }) {
  const [query, setQuery] = useState('');

  // ✅ Step 1: Create a ref
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // ✅ Step 3: Access the real DOM element via .current
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal">
      {/* ✅ Step 2: Attach the ref to the element */}
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
    </div>
  );
}`,
  explanation: `**What useRef does:**
\`useRef\` gives you a mutable object \`{ current: ... }\` that persists across renders. When attached to a DOM element via the \`ref\` prop, \`.current\` points to the actual DOM node.

**Three things refs are used for:**
1. **DOM access**: focus, scroll, measure size, integrate non-React libraries
2. **Storing values without re-render**: timers, previous values, animation IDs
3. **Instance variables**: anything you want to read/write without triggering a render

**The crucial difference vs useState:**
- \`useState\` → changing value triggers re-render
- \`useRef\` → changing \`.current\` does NOT trigger re-render

\`\`\`js
const ref = useRef(initialValue)
// ref.current = initialValue
// ref.current can be mutated freely
// mutations don't cause re-renders
\`\`\`

**Why not use document.getElementById?**
It works, but it breaks React's mental model. Refs are the designed escape hatch — they're reliable even with server-side rendering, concurrent features, and dynamic ids.`,
  takeaway:
    "useRef is React's escape hatch to the real DOM — use it for focus, scroll, timers, and any imperative DOM operation.",
  tags: ["useRef", "refs", "DOM", "hooks", "accessibility", "focus"],
  estimatedMinutes: 14,
}

export default lesson
