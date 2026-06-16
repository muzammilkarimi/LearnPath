import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Clock } from "lucide-react"
import { getRoadmap } from "@/content/roadmaps"
import { RoadmapGraph } from "@/components/roadmap/RoadmapGraph"

interface Props {
  params: Promise<{ role: string }>
}

export default async function RoadmapPage({ params }: Props) {
  const { role } = await params
  const roadmap = getRoadmap(role)
  if (!roadmap || roadmap.comingSoon) notFound()

  const essentialCount = roadmap.nodes.filter((n) => n.priority === "essential").length

  return (
    <div className="min-h-screen bg-canvas">
      {/* Sticky top bar */}
      <div className="sticky top-14 z-20 border-b border-hairline px-4 md:px-6 py-3 flex items-center justify-between bg-canvas/95 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-xs text-mute overflow-hidden">
          <Link href="/" className="hover:text-ink transition-colors shrink-0">Home</Link>
          <ChevronRight size={11} className="shrink-0" />
          <Link href="/roadmap" className="hover:text-ink transition-colors shrink-0">Roadmaps</Link>
          <ChevronRight size={11} className="shrink-0" />
          <span className="text-body truncate">{roadmap.title}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-mute shrink-0 ml-4">
          <span className="hidden sm:flex items-center gap-1">
            <Clock size={11} /> ~{roadmap.totalHours}h total
          </span>
          <span className="hidden sm:block">{roadmap.nodes.length} topics</span>
          <span className="text-primary font-semibold">{essentialCount} essential</span>
        </div>
      </div>

      {/* Roadmap canvas — scrolls naturally with the page */}
      <div className="px-4 md:px-8 py-10">
        <RoadmapGraph roadmap={roadmap} />
      </div>

      {/* Legend */}
      <div className="border-t border-hairline px-4 md:px-6 py-3 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-4 text-[11px] text-mute">
          {[
            { label: "Essential", dot: "bg-primary" },
            { label: "Good to know", dot: "bg-yellow-400" },
            { label: "Optional", dot: "bg-mute" },
          ].map(({ label, dot }) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
              {label}
            </span>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-4 text-[11px] text-mute">
          {[
            { label: "Locked", icon: "🔒" },
            { label: "Available", icon: "○" },
            { label: "Done", icon: "✓" },
          ].map(({ label, icon }) => (
            <span key={label} className="flex items-center gap-1.5">
              <span>{icon}</span> {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
