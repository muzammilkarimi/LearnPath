import type { TechModule } from "@/lib/types"

// Foundation lessons
import lesson00 from "./lessons/00-what-is-jsx"
import lesson00b from "./lessons/00b-components-and-props"
import lesson00c from "./lessons/00c-event-handling"
import lesson00d from "./lessons/00d-conditional-rendering"
import lesson00e from "./lessons/00e-lists-and-keys"

// Hooks lessons
import lesson01 from "./lessons/01-the-dashboard-crisis"
import lesson02 from "./lessons/02-the-infinite-loop"
import lesson03 from "./lessons/03-prop-drilling-nightmare"
import lesson04 from "./lessons/04-the-slow-list"
import lesson05 from "./lessons/05-the-focus-bug"

import hooksQuestions from "./interview-questions/hooks"
import quizQuestions from "./interview-questions/quiz"

const reactModule: TechModule = {
  id: "react",
  name: "React",
  tagline: "Build UIs that think like a developer",
  description:
    "Learn React through real workplace situations — bugs to fix, features to ship, and production fires to put out. Every concept taught in context, not in isolation.",
  icon: "⚛️",
  color: "#61DAFB",
  tags: ["frontend", "javascript", "ui"],
  comingSoon: false,
  playground: {
    type: "browser",
    language: "javascript",
  },
  paths: [
    {
      id: "beginner",
      name: "Junior Developer",
      description:
        "You just joined Acme Corp. Learn the fundamentals through real bugs, broken components, and your first sprint.",
      difficulty: "beginner",
      estimatedHours: 6,
      lessonIds: [
        lesson00.id,
        lesson00b.id,
        lesson00c.id,
        lesson00d.id,
        lesson00e.id,
        lesson01.id,
        lesson02.id,
        lesson03.id,
        lesson04.id,
        lesson05.id,
      ],
    },
    {
      id: "intermediate",
      name: "Mid-Level Developer",
      description:
        "You are trusted with bigger features. Custom hooks, patterns, and performance tuning.",
      difficulty: "intermediate",
      estimatedHours: 6,
      lessonIds: [],
    },
    {
      id: "advanced",
      name: "Senior Developer",
      description:
        "Architecture decisions, mentoring others, and the subtle art of not breaking things.",
      difficulty: "advanced",
      estimatedHours: 8,
      lessonIds: [],
    },
  ],
  interviewQuestions: [...hooksQuestions, ...quizQuestions],
}

export const lessons = [
  lesson00,
  lesson00b,
  lesson00c,
  lesson00d,
  lesson00e,
  lesson01,
  lesson02,
  lesson03,
  lesson04,
  lesson05,
]

export default reactModule
