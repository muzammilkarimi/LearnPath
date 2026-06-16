import type { TechModule } from "@/lib/types"
import reactModule, { lessons as reactLessons } from "./react"
import systemDesignModule, { lessons as sdLessons } from "./system-design"

// All registered tech modules — add new ones here
export const techModules: TechModule[] = [
  reactModule,
  systemDesignModule,
  {
    id: "typescript",
    name: "TypeScript",
    tagline: "Write JavaScript that yells back (helpfully)",
    description: "Coming soon.",
    icon: "🔷",
    color: "#3178C6",
    tags: ["frontend", "backend", "javascript"],
    comingSoon: true,
    playground: { type: "browser", language: "typescript" },
    paths: [],
    interviewQuestions: [],
  },
  {
    id: "nodejs",
    name: "Node.js",
    tagline: "JavaScript on the server side",
    description: "Coming soon.",
    icon: "🟢",
    color: "#339933",
    tags: ["backend", "javascript", "server"],
    comingSoon: true,
    playground: { type: "node", language: "javascript" },
    paths: [],
    interviewQuestions: [],
  },
]

export function getTechModule(id: string): TechModule | undefined {
  return techModules.find((m) => m.id === id)
}

// All lessons indexed by ID for fast lookup
const allLessonsMap = new Map([
  ...reactLessons.map((l) => [l.id, l] as const),
  ...sdLessons.map((l) => [l.id, l] as const),
])

export function getLesson(id: string) {
  return allLessonsMap.get(id)
}

export function getLessonsForPath(techId: string, pathId: string) {
  const module = getTechModule(techId)
  if (!module) return []
  const path = module.paths.find((p) => p.id === pathId)
  if (!path) return []
  return path.lessonIds.map((id) => allLessonsMap.get(id)).filter(Boolean)
}
