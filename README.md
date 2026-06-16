# LearnPath

A story-based, multi-technology developer learning platform. Every concept is taught through a real workplace situation — bugs to fix, deadlines to meet, and a PM breathing down your neck. Just like the job.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss)

## What makes it different

Most learning platforms teach concepts in isolation — "here is what `useState` does." LearnPath puts you inside a story. You're a developer at **Acme Corp**. Your PM Sarah just filed a ticket. Senior dev Jake is in the Slack thread. The bug is real, the deadline is tight, and the concept you need to learn is the *only way out*.

- **Story-first lessons** — context before concept, every time
- **AI mentor (Socratic method)** — asks you questions back instead of giving the answer
- **Interactive flashcards + quiz** — 3D flip cards and animated MCQ with scoring
- **Live code playground** — Monaco Editor, show/hide solution, reset
- **Progress tracking** — lessons and bookmarks saved locally

## Modules

### React (10 lessons)
Fundamentals path covering JSX, components, events, conditional rendering, lists, then hooks: `useState`, `useEffect`, `useContext`, `useMemo`, `useRef`.

### System Design (5 lessons)
Foundations path sourced from [roadmap.sh/system-design](https://roadmap.sh/system-design) — horizontal scaling, caching with Redis, message queues, SQL vs NoSQL, and a full URL shortener design walkthrough. Playground is a markdown design document editor.

**Coming soon:** TypeScript, Node.js, more advanced paths.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 with `@theme` tokens |
| Code editor | Monaco Editor (`@monaco-editor/react`) |
| Animations | Framer Motion v12 |
| State | Zustand with `persist` middleware |
| AI Mentor | Anthropic SDK (`claude-sonnet-4-6`) |
| Design system | VoltAgent — dark canvas, electric green accent |

## Getting started

**1. Clone and install**

```bash
git clone https://github.com/YOUR_USERNAME/learnpath.git
cd learnpath
npm install
```

**2. Set up the AI Mentor**

Create a `.env.local` file in the project root:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

Get your API key at [console.anthropic.com](https://console.anthropic.com). The AI Mentor won't work without it, but all lessons and quizzes work fine without a key.

**3. Run the dev server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── [tech]/             # Dynamic tech module routes
│   │   ├── page.tsx        # Module overview
│   │   ├── learn/[path]/   # Lesson list
│   │   └── interview/      # Interview prep hub
│   └── api/mentor/         # AI Mentor API endpoint
├── components/
│   ├── CodePlayground.tsx  # Monaco editor with solution reveal
│   ├── FlashCardDeck.tsx   # 3D flip card deck
│   ├── QuizMode.tsx        # Animated MCQ quiz with scoring
│   ├── InterviewHub.tsx    # Browse / Flashcards / Quiz switcher
│   └── Navbar.tsx
├── content/
│   ├── registry.ts         # All tech modules registered here
│   ├── react/              # React module — 10 lessons, 36 questions
│   └── system-design/      # System Design module — 5 lessons, 24 questions
├── lib/
│   └── types.ts            # Shared TypeScript types
└── store/
    └── progressStore.ts    # Zustand progress store
```

## Adding a new technology module

The platform shell is completely tech-agnostic. To add a new module:

1. Create `src/content/[tech]/index.ts` — export a `TechModule` object and a `lessons` array
2. Create lesson files in `src/content/[tech]/lessons/`
3. Create interview questions in `src/content/[tech]/interview-questions/`
4. Register the module in `src/content/registry.ts` — two lines

No platform code changes needed.

## Design system

VoltAgent-inspired dark design — defined in `src/app/globals.css` as Tailwind v4 `@theme` tokens.

| Token | Value | Use |
|---|---|---|
| `--color-canvas` | `#101010` | Page background |
| `--color-primary` | `#00d992` | Electric green accent |
| `--color-ink` | `#e4e0db` | Primary text |
| `--color-hairline` | `rgba(255,255,255,0.08)` | Borders |

No light mode. No shadows. Hairline borders only.

## License

MIT
