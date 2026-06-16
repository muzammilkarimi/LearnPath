import type { Roadmap } from "@/lib/types"
import frontendRoadmap from "./frontend"

export const roadmaps: Roadmap[] = [
  frontendRoadmap,
  {
    id: "backend",
    role: "Backend Developer",
    title: "Backend Developer",
    tagline: "APIs, databases, and systems that scale",
    description: "Coming soon.",
    icon: "⚙️",
    color: "#3178C6",
    totalHours: 130,
    comingSoon: true,
    nodes: [],
    edges: [],
  },
  {
    id: "devops",
    role: "DevOps Engineer",
    title: "DevOps Engineer",
    tagline: "Ship faster, break less, sleep more",
    description: "Coming soon.",
    icon: "🚀",
    color: "#f97316",
    totalHours: 110,
    comingSoon: true,
    nodes: [],
    edges: [],
  },
  {
    id: "fullstack",
    role: "Full Stack Developer",
    title: "Full Stack Developer",
    tagline: "Own the entire product",
    description: "Coming soon.",
    icon: "⚡",
    color: "#a78bfa",
    totalHours: 200,
    comingSoon: true,
    nodes: [],
    edges: [],
  },
]

export function getRoadmap(id: string): Roadmap | undefined {
  return roadmaps.find((r) => r.id === id)
}
