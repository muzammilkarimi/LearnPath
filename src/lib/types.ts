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
  completedRoadmapNodes: Record<string, boolean> // nodeId -> done
  lastVisited?: string                           // lessonId
}

export type NodePriority = "essential" | "good-to-know" | "optional"
export type NodeStatus = "locked" | "available" | "completed"

export interface RoadmapNode {
  id: string
  title: string
  description: string
  why: string                   // why this matters / why in this order
  priority: NodePriority
  interviewWeight: 1 | 2 | 3 | 4 | 5
  estimatedHours: number
  prerequisites: string[]       // node IDs that must be completed first
  linkedLessonId?: string       // links to a LearnPath lesson
  linkedLessonPath?: string     // e.g. "/react/learn/beginner/01-the-dashboard-crisis"
  tags: string[]
  position: { x: number; y: number }
}

export interface RoadmapEdge {
  id: string
  source: string
  target: string
  why?: string                  // why A must come before B
}

export interface Roadmap {
  id: string
  role: string
  title: string
  tagline: string
  description: string
  icon: string
  color: string
  totalHours: number
  comingSoon?: boolean
  nodes: RoadmapNode[]
  edges: RoadmapEdge[]
}
