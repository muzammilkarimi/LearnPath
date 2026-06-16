import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Clock, ChevronRight } from "lucide-react"
import { getTechModule, getLessonsForPath } from "@/content/registry"
import type { Lesson } from "@/lib/types"

interface Props {
  params: Promise<{ tech: string; pathId: string }>
}

export default async function PathPage({ params }: Props) {
  const { tech: techId, pathId } = await params
  const techModule = getTechModule(techId)
  if (!techModule) notFound()

  const path = techModule.paths.find((p) => p.id === pathId)
  if (!path) notFound()

  const lessons = getLessonsForPath(techId, pathId) as Lesson[]

  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <section className="border-b border-hairline px-4 md:px-8 py-10 md:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-xs text-mute mb-8">
            <Link href="/" className="hover:text-ink transition-colors">
              Home
            </Link>
            <ChevronRight size={12} />
            <Link
              href={`/${techId}`}
              className="hover:text-ink transition-colors"
            >
              {techModule.name}
            </Link>
            <ChevronRight size={12} />
            <span className="text-body">{path.name}</span>
          </div>

          <p className="text-xs font-semibold tracking-[2.52px] uppercase text-primary mb-3">
            {path.difficulty} path
          </p>
          <h1 className="text-[36px] font-normal leading-10 tracking-[-0.9px] text-ink-strong mb-3">
            {path.name}
          </h1>
          <p className="text-base text-body max-w-2xl mb-6">{path.description}</p>
          <div className="flex items-center gap-6 text-sm text-mute">
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              {path.estimatedHours} hours
            </span>
            <span>{lessons.length} lessons</span>
          </div>
        </div>
      </section>

      {/* Lesson list */}
      <section className="px-4 md:px-8 py-10 md:py-12">
        <div className="mx-auto max-w-7xl max-w-2xl">
          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <Link
                key={lesson.id}
                href={`/${techId}/learn/${pathId}/${lesson.id}`}
                className="flex items-start gap-5 border border-hairline rounded-[8px] p-5 bg-canvas hover:border-primary hover:shadow-[0_0_15px_rgba(92,88,85,0.2)] transition-all group"
              >
                <div className="flex-shrink-0 w-7 h-7 rounded-full border border-hairline flex items-center justify-center mt-0.5">
                  <span className="text-xs font-mono text-mute">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-primary font-mono">
                      {lesson.concept}
                    </span>
                    <span className="text-mute text-xs">·</span>
                    <span className="text-xs text-mute">
                      {lesson.estimatedMinutes} min
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-ink mb-1 group-hover:text-ink-strong transition-colors">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-mute">{lesson.storyTitle}</p>
                </div>

                <ArrowRight
                  size={16}
                  className="text-mute group-hover:text-primary transition-colors flex-shrink-0 mt-1"
                />
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href={`/${techId}/learn/${pathId}/${lessons[0]?.id}`}
              className="flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold px-6 py-3 rounded-[6px] hover:bg-primary-soft transition-colors w-full"
            >
              Start Lesson 1 <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
