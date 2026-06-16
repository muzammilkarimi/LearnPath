import type { TechModule } from "@/lib/types"

import lesson01 from "./lessons/01-the-viral-moment"
import lesson02 from "./lessons/02-the-database-bottleneck"
import lesson03 from "./lessons/03-the-payment-timeout"
import lesson04 from "./lessons/04-sql-vs-nosql"
import lesson05 from "./lessons/05-design-a-url-shortener"

import fundamentalQuestions from "./interview-questions/fundamentals"
import quizQuestions from "./interview-questions/quiz"

const systemDesignModule: TechModule = {
  id: "system-design",
  name: "System Design",
  tagline: "Architect systems that survive the real world",
  description:
    "Learn to design scalable, reliable systems through real engineering war stories — viral traffic spikes, database bottlenecks, and the classic interview questions that separate senior engineers from the rest.",
  icon: "🏗️",
  color: "#a78bfa",
  tags: ["architecture", "backend", "infrastructure"],
  comingSoon: false,
  playground: {
    type: "browser",
    language: "markdown",
  },
  paths: [
    {
      id: "foundations",
      name: "Foundations",
      description:
        "The core building blocks every engineer must understand: scaling, caching, queues, databases, and how to think about system design problems.",
      difficulty: "intermediate",
      estimatedHours: 8,
      lessonIds: [
        lesson01.id,
        lesson02.id,
        lesson03.id,
        lesson04.id,
        lesson05.id,
      ],
    },
    {
      id: "real-systems",
      name: "Design Real Systems",
      description:
        "Design Twitter, Instagram, Uber, and other iconic systems from scratch. The exact questions you get in senior engineering interviews.",
      difficulty: "advanced",
      estimatedHours: 10,
      lessonIds: [],
    },
  ],
  interviewQuestions: [...fundamentalQuestions, ...quizQuestions],
}

export const lessons = [lesson01, lesson02, lesson03, lesson04, lesson05]

export default systemDesignModule
