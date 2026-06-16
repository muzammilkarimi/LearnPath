import Link from "next/link"
import { ArrowRight, Clock, Map } from "lucide-react"
import { roadmaps } from "@/content/roadmaps"

export default function RoadmapsPage() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <section className="border-b border-hairline px-4 md:px-8 py-14 md:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[2.52px] uppercase text-primary mb-6">
            Developer Roadmaps
          </p>
          <h1 className="text-[38px] md:text-[54px] font-normal leading-tight tracking-[-0.65px] text-ink-strong max-w-3xl mb-5">
            Know exactly what to learn next.
          </h1>
          <p className="text-base md:text-lg text-body max-w-2xl leading-7">
            Every node is ordered by dependency, weighted by interview frequency,
            and linked to a real lesson. Not a poster — a curriculum you can follow.
          </p>
        </div>
      </section>

      {/* Differentiators */}
      <section className="border-b border-dashed border-hairline px-4 md:px-8 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Ordered by dependency",
                body: "Every arrow has a reason. We explain why A must come before B — not just that it does.",
              },
              {
                title: "Weighted by interviews",
                body: "Each topic shows how often it appears in job interviews (1–5 dots). Prioritize ruthlessly.",
              },
              {
                title: "Linked to lessons",
                body: "Nodes with a lesson link open directly into a story-based lesson. The roadmap IS the curriculum.",
              },
            ].map(({ title, body }) => (
              <div key={title} className="border border-hairline rounded-xl p-5 bg-canvas">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mb-4" />
                <h3 className="text-sm font-semibold text-ink mb-2">{title}</h3>
                <p className="text-sm text-body leading-5">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap cards */}
      <section className="px-4 md:px-8 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[2.52px] uppercase text-mute mb-8">
            Available Roadmaps
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {roadmaps.map((r) => {
              const inner = (
                <>
                  <div className="text-3xl mb-4">{r.icon}</div>
                  <h3 className="text-base font-semibold text-ink mb-1">{r.title}</h3>
                  <p className="text-sm text-body leading-5 mb-4">{r.tagline}</p>
                  <div className="flex items-center gap-3 text-xs text-mute mt-auto">
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      ~{r.totalHours}h
                    </span>
                    <span>{r.nodes.length > 0 ? `${r.nodes.length} topics` : "Coming soon"}</span>
                  </div>
                </>
              )

              if (r.comingSoon) {
                return (
                  <div
                    key={r.id}
                    className="relative border border-hairline rounded-xl p-6 bg-canvas opacity-50 cursor-not-allowed flex flex-col"
                  >
                    {inner}
                    <span className="absolute top-3 right-3 text-[10px] font-semibold tracking-widest uppercase text-mute border border-hairline rounded-full px-2 py-0.5">
                      Soon
                    </span>
                  </div>
                )
              }

              return (
                <Link
                  key={r.id}
                  href={`/roadmap/${r.id}`}
                  className="flex flex-col border border-hairline rounded-xl p-6 bg-canvas hover:border-primary hover:shadow-[0_0_20px_rgba(0,217,146,0.08)] transition-all group"
                >
                  {inner}
                  <div className="flex items-center gap-1.5 text-xs text-primary mt-4 font-semibold">
                    View roadmap <ArrowRight size={12} />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Compared to roadmap.sh */}
      <section className="border-t border-dashed border-hairline px-4 md:px-8 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[2.52px] uppercase text-mute mb-8">
            What&apos;s different
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            {[
              ["roadmap.sh", "LearnPath"],
              ["Static poster", "Interactive, progress-tracked"],
              ["Links to external resources", "Links to built-in lessons"],
              ["No explanation for ordering", "Every edge explains why"],
              ["Same map for everyone", "Progress is yours, synced locally"],
              ["No interview signal", "Interview weight per topic (1–5)"],
            ].map(([a, b], i) => (
              <div key={i} className={`grid grid-cols-2 gap-4 ${i === 0 ? "text-xs font-semibold tracking-widest uppercase text-mute pb-2 border-b border-hairline" : "text-sm"}`}>
                <span className={i === 0 ? "" : "text-mute"}>{a}</span>
                <span className={i === 0 ? "text-primary" : "text-ink"}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
