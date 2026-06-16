export type Difficulty = "beginner" | "intermediate" | "advanced"
export type PlaygroundType = "browser" | "node" | "python"

export interface Lesson {
  id: string
  tech: string
  pathId: string
  order: number
  title: string
  storyTitle: string
  storyContext: string       // The narrative situation
  concept: string            // React concept being taught
  challenge: string          // What the user needs to solve
  starterCode: string
  solution: string
  explanation: string        // Post-solution walkthrough
  takeaway: string           // One-sentence mental model
  tags: string[]
  estimatedMinutes: number
}

export interface InterviewQuestion {
  id: string
  tech: string
  question: string
  answer: string
  shortAnswer?: string     // 1-2 sentence version for flashcard back
  options?: string[]       // MCQ: [correct, wrong, wrong, wrong]
  difficulty: Difficulty
  tags: string[]
  followUps?: string[]
}

export interface LearningPath {
  id: string
  name: string
  description: string
  difficulty: Difficulty
  lessonIds: string[]
  estimatedHours: number
}

export interface TechModule {
  id: string
  name: string
  tagline: string
  description: string
  icon: string               // emoji
  color: string              // accent hex
  tags: string[]
  comingSoon?: boolean
  paths: LearningPath[]
  interviewQuestions: InterviewQuestion[]
  playground: {
    type: PlaygroundType
    language: string         // monaco language id
  }
}

export interface UserProgress {
  completedLessons: Record<string, boolean>      // lessonId -> done
  bookmarkedQuestions: Record<string, boolean>   // questionId -> saved
  lastVisited?: string                           // lessonId
}
