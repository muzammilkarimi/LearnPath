import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Clock, ChevronRight } from "lucide-react"
import { getTechModule } from "@/content/registry"

interface Props {
  params: Promise<{ tech: string }>
}

export default async function TechHubPage({ params }: Props) {
  const { tech: techId } = await params
  const module = getTechModule(techId)
  if (!module) notFound()

  const difficultyColor: Record<string, string> = {
    beginner: "text-primary",
    intermediate: "text-yellow-400",
    advanced: "text-orange-400",
  }

  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <section className="border-b border-hairline px-4 md:px-8 py-10 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-xs text-mute mb-8">
            <Link href="/" className="hover:text-ink transition-colors">
              Home
            </Link>
            <ChevronRight size={12} />
            <span className="text-body">{module.name}</span>
          </div>

          <div className="flex items-start gap-6">
            <span className="text-5xl">{module.icon}</span>
            <div>
              <p className="text-xs font-semibold tracking-[2.52px] uppercase text-mute mb-2">
                Learning Path
              </p>
              <h1 className="text-[36px] font-normal leading-10 tracking-[-0.9px] text-ink-strong mb-3">
                {module.name}
              </h1>
              <p className="text-base text-body max-w-2xl leading-6">
                {module.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Paths */}
      <section className="px-4 md:px-8 py-10 md:py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[2.52px] uppercase text-mute mb-8 md:mb-10">
            Learning Paths
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {module.paths.map((path) => {
              const isAvailable = path.lessonIds.length > 0
              const card = (
                <div
                  className={`border border-hairline rounded-[8px] p-6 bg-canvas h-full flex flex-col ${
                    isAvailable
                      ? "hover:border-primary hover:shadow-[0_0_15px_rgba(92,88,85,0.2)] transition-all cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-xs font-semibold tracking-widest uppercase ${difficultyColor[path.difficulty]}`}
                    >
                      {path.difficulty}
                    </span>
                    {!isAvailable && (
                      <span className="text-[10px] font-semibold tracking-widest uppercase text-mute border border-hairline rounded-full px-2 py-0.5">
                        Soon
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-ink mb-2">
                    {path.name}
                  </h3>
                  <p className="text-sm text-body leading-5 mb-6 flex-1">
                    {path.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-mute">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {path.estimatedHours}h
                      </span>
                      <span>{path.lessonIds.length} lessons</span>
                    </div>
                    {isAvailable && (
                      <ArrowRight size={16} className="text-primary" />
                    )}
                  </div>
                </div>
              )

              if (!isAvailable) return <div key={path.id}>{card}</div>

              return (
                <Link
                  key={path.id}
                  href={`/${techId}/learn/${path.id}`}
                  className="block"
                >
                  {card}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Interview CTA */}
      <section className="border-t border-dashed border-hairline px-4 md:px-8 py-10 md:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="border border-hairline rounded-[8px] p-6 md:p-8 flex flex-col sm:flex-row sm:items-center gap-5 sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[2.52px] uppercase text-mute mb-2">
                Interview Prep
              </p>
              <h3 className="text-xl md:text-2xl font-semibold text-ink mb-1">
                Ready to pass the interview?
              </h3>
              <p className="text-sm text-body">
                {module.interviewQuestions.length} questions with answers,
                follow-ups, and explanations.
              </p>
            </div>
            <Link
              href={`/${techId}/interview`}
              className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-5 py-3 rounded-md text-sm hover:bg-primary-soft transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              Interview Prep <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
