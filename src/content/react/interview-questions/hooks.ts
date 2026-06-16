import type { InterviewQuestion } from "@/lib/types"

const questions: InterviewQuestion[] = [
  {
    id: "rq-01",
    tech: "react",
    question: "What is the difference between state and props?",
    shortAnswer:
      "Props are read-only values passed from parent to child. State is internal, mutable data owned by a component. Changing state triggers a re-render; props cannot be changed by the component that receives them.",
    answer:
      "Props are read-only values passed from a parent to a child component — the child cannot change them. State is internal, mutable data owned by a component that can change over time. When state changes, React re-renders the component. Think of props as arguments you receive, and state as variables you own.",
    difficulty: "beginner",
    tags: ["state", "props", "fundamentals"],
    followUps: [
      "Can a child component ever modify its props?",
      "When would you lift state up to a parent?",
    ],
  },
  {
    id: "rq-02",
    tech: "react",
    question: "Explain the useState hook and when you'd use it.",
    shortAnswer:
      "useState returns [value, setter]. Calling the setter schedules a re-render with the new value. Use it for any local, synchronous UI state that should cause a re-render when it changes.",
    answer:
      "useState returns a state value and a setter function. When the setter is called, React re-renders the component with the new value. Use it for any value that: (1) should cause a re-render when it changes, (2) needs to persist between renders, and (3) is local to that component. Examples: form input values, toggle states, counters, loading flags.",
    difficulty: "beginner",
    tags: ["useState", "hooks", "state"],
    followUps: [
      "What happens if you call the setter with the same value?",
      "How do you update an object stored in useState?",
    ],
  },
  {
    id: "rq-03",
    tech: "react",
    question: "What are the rules of hooks and why do they exist?",
    shortAnswer:
      "Only call hooks at the top level (not inside loops or conditionals) and only from React functions. React tracks hooks by call order — conditional calls break that order and corrupt state.",
    answer:
      "Two rules: (1) Only call hooks at the top level — never inside loops, conditions, or nested functions. (2) Only call hooks from React functions — not plain JavaScript functions. They exist because React tracks hooks by their call order. If you call hooks conditionally, the order changes between renders and React loses track of which state belongs to which hook.",
    difficulty: "beginner",
    tags: ["hooks", "rules", "fundamentals"],
    followUps: [
      "What error do you get if you break the rules of hooks?",
      "Can you call a hook inside a useEffect?",
    ],
  },
  {
    id: "rq-04",
    tech: "react",
    question: "When does useEffect run? Explain the three forms.",
    shortAnswer:
      "No deps: after every render. Empty []: once on mount. [dep]: on mount and whenever dep changes. The returned cleanup function runs before the next effect and on unmount.",
    answer:
      "useEffect runs after the render is committed to the DOM. Three forms: (1) No dependency array — runs after every render (rarely what you want). (2) Empty array [] — runs once after mount. (3) [dep1, dep2] — runs after mount and whenever listed dependencies change. The cleanup function (returned from useEffect) runs before the next effect and on unmount.",
    difficulty: "beginner",
    tags: ["useEffect", "lifecycle", "hooks"],
    followUps: [
      "What is a cleanup function and when would you use it?",
      "How is useEffect different from componentDidMount?",
    ],
  },
  {
    id: "rq-05",
    tech: "react",
    question: "What is the difference between useMemo and useCallback?",
    shortAnswer:
      "useMemo caches a computed value. useCallback caches a function reference. Both recompute only when dependencies change. useMemo = memoize result; useCallback = memoize function.",
    answer:
      "useMemo caches the *result* of a function call. useCallback caches the *function itself*. useMemo is for expensive computed values; useCallback is for function references (useful when passing callbacks to child components that use React.memo, to prevent unnecessary re-renders). Both take a dependency array and only recompute/recreate when dependencies change.",
    difficulty: "intermediate",
    tags: ["useMemo", "useCallback", "performance", "memoization"],
    followUps: [
      "Can you implement useCallback using useMemo?",
      "When would useCallback NOT help performance?",
    ],
  },
  {
    id: "rq-06",
    tech: "react",
    question: "What problem does useContext solve?",
    shortAnswer:
      "It solves prop drilling — passing data through layers of components that don't use it. Context lets any descendant read a value directly without threading it through every level.",
    answer:
      "Prop drilling — passing data through intermediate components that don't need it just to reach a deeply nested child. useContext lets any component in the tree access a value directly without passing it through every level. Common uses: theme, authentication state, language/locale, and any app-wide configuration.",
    difficulty: "beginner",
    tags: ["useContext", "context", "prop-drilling"],
    followUps: [
      "What are the downsides of using Context for frequently changing values?",
      "How would you avoid unnecessary re-renders with Context?",
    ],
  },
  {
    id: "rq-07",
    tech: "react",
    question: "What is useRef and what are its two main use cases?",
    shortAnswer:
      "useRef returns { current: value } — mutable, persists across renders, changes don't trigger re-renders. Use it for: (1) DOM access (focus, scroll, measure) and (2) storing values that shouldn't cause re-renders (timers, previous values).",
    answer:
      "useRef returns a mutable object { current: value } that persists across renders without triggering re-renders when mutated. Two main uses: (1) DOM access — attach it to an element via the ref prop to call methods like .focus(), .scrollIntoView(), or measure dimensions. (2) Storing mutable values — like timer IDs, previous prop values, or animation references that shouldn't cause re-renders when they change.",
    difficulty: "intermediate",
    tags: ["useRef", "refs", "DOM", "hooks"],
    followUps: [
      "What's the difference between a ref and a state variable?",
      "Can you store a ref in useState? What would happen?",
    ],
  },
  {
    id: "rq-08",
    tech: "react",
    question: "What is the Virtual DOM and why does React use it?",
    shortAnswer:
      "The Virtual DOM is an in-memory JS representation of the real DOM. React diffs the new vs old virtual tree (reconciliation) and only applies the minimal real DOM updates needed — batching writes to avoid expensive repaints.",
    answer:
      "The Virtual DOM is an in-memory JavaScript representation of the real DOM tree. When state changes, React re-renders the virtual tree, diffs it against the previous version (reconciliation), and only applies the minimal set of real DOM changes needed. This batches DOM updates and avoids expensive repaints. The real DOM is slow to write; JavaScript objects are fast to diff.",
    difficulty: "intermediate",
    tags: ["virtual-dom", "reconciliation", "performance", "fundamentals"],
    followUps: [
      "What is the diffing algorithm React uses?",
      "Why are keys important in lists?",
    ],
  },
  {
    id: "rq-09",
    tech: "react",
    question: "Why do we need keys in lists and what makes a good key?",
    shortAnswer:
      "Keys let React match list items across re-renders by identity instead of position. Without keys, reordering or deleting items causes incorrect state (e.g., checked checkboxes move to wrong rows). Always use stable unique IDs — never array index.",
    answer:
      "Keys help React identify which items changed, were added, or were removed in a list. Without keys, React re-renders entire lists even if only one item changed. A good key is stable (doesn't change between renders), unique among siblings, and predictable. Use database IDs or content hashes — never array index, which can cause bugs when items are reordered or deleted.",
    difficulty: "beginner",
    tags: ["keys", "lists", "performance", "reconciliation"],
    followUps: [
      "What bug can happen if you use index as a key with a sortable list?",
      "Does the key need to be globally unique?",
    ],
  },
  {
    id: "rq-10",
    tech: "react",
    question: "Explain React's reconciliation algorithm in simple terms.",
    shortAnswer:
      "Reconciliation is React's process of comparing the new virtual DOM against the previous one to find the minimum DOM changes needed. Same element type = update attributes in place. Different type = destroy and rebuild. Keys help match list items.",
    answer:
      "Reconciliation is React's process for deciding what actually needs to change in the DOM. React compares the new virtual DOM tree with the previous one element by element. Rules: (1) Elements of different types are destroyed and rebuilt. (2) Elements of the same type update their attributes in place. (3) Keys allow React to match list items across renders. React assumes that elements at the same position are the same component — keys override this.",
    difficulty: "advanced",
    tags: ["reconciliation", "virtual-dom", "diffing", "performance"],
    followUps: [
      "What triggers a re-render in React?",
      "How does React Fiber improve on the original reconciler?",
    ],
  },
  {
    id: "rq-11",
    tech: "react",
    question: "What is a custom hook and when would you create one?",
    shortAnswer:
      "A custom hook is a function starting with 'use' that calls other hooks. Create one to extract reusable stateful logic — same motivation as a utility function, but for logic that involves hooks. Examples: useFetch, useDebounce, useLocalStorage.",
    answer:
      "A custom hook is a JavaScript function that starts with 'use' and calls other hooks. You create one to extract reusable stateful logic from components — the same way you extract repetitive code into utility functions, but for logic that involves hooks. Examples: useWindowSize, useLocalStorage, useFetch, useDebounce. They let multiple components share behavior without sharing state.",
    difficulty: "intermediate",
    tags: ["custom-hooks", "hooks", "reusability", "patterns"],
    followUps: [
      "How is a custom hook different from a regular utility function?",
      "Does state in a custom hook get shared between components that use it?",
    ],
  },
  {
    id: "rq-12",
    tech: "react",
    question: "What is useReducer and when would you choose it over useState?",
    shortAnswer:
      "useReducer manages state via a (state, action) => newState function. Choose it over useState when you have complex state with multiple sub-values, many transitions, or when next state depends on previous state in non-trivial ways.",
    answer:
      "useReducer manages state through a reducer function: (state, action) => newState — the same pattern as Redux. Use it when: (1) state has multiple related sub-values, (2) next state depends on previous state in complex ways, (3) you have many state transitions that share logic, or (4) you want to keep state transition logic outside the component. For simple flags or counts, useState is cleaner.",
    difficulty: "intermediate",
    tags: ["useReducer", "state", "patterns", "redux"],
    followUps: [
      "How would you combine useReducer with useContext to replace Redux?",
      "What is the difference between useReducer and useState under the hood?",
    ],
  },
]

export default questions
