import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Clock, Tag } from "lucide-react"
import { getTechModule, getLesson, getLessonsForPath } from "@/content/registry"
import { CodePlayground } from "@/components/CodePlayground"
import { AIMentor } from "@/components/AIMentor"
import { LessonNav } from "@/components/LessonNav"
import type { Lesson } from "@/lib/types"

interface Props {
  params: Promise<{ tech: string; pathId: string; lessonId: string }>
}

export default async function LessonPage({ params }: Props) {
  const { tech: techId, pathId, lessonId } = await params
  const module = getTechModule(techId)
  if (!module) notFound()

  const lesson = getLesson(lessonId) as Lesson | undefined
  if (!lesson) notFound()

  const allLessons = getLessonsForPath(techId, pathId) as Lesson[]
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      {/* Breadcrumb */}
      <div className="border-b border-hairline px-8 py-3">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-xs text-mute">
            <Link href="/" className="hover:text-ink transition-colors">
              Home
            </Link>
            <ChevronRight size={11} />
            <Link
              href={`/${techId}`}
              className="hover:text-ink transition-colors"
            >
              {module.name}
            </Link>
            <ChevronRight size={11} />
            <Link
              href={`/${techId}/learn/${pathId}`}
              className="hover:text-ink transition-colors capitalize"
            >
              {pathId}
            </Link>
            <ChevronRight size={11} />
            <span className="text-body truncate max-w-48">{lesson.title}</span>
          </div>
        </div>
      </div>

      {/* Main layout: story left, playground right */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Story + explanation */}
        <div className="w-[45%] flex-shrink-0 overflow-y-auto border-r border-hairline">
          {/* Story card */}
          <div className="border-b border-dashed border-hairline p-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-xs font-semibold tracking-[2.52px] uppercase text-primary">
                {lesson.concept}
              </span>
              <span className="text-hairline-soft">·</span>
              <span className="flex items-center gap-1 text-xs text-mute">
                <Clock size={11} />
                {lesson.estimatedMinutes} min
              </span>
            </div>

            <h1 className="text-[24px] font-bold leading-8 tracking-[-0.6px] text-ink-strong mb-1">
              {lesson.title}
            </h1>
            <p className="text-sm text-primary font-mono mb-6">
              {lesson.storyTitle}
            </p>

            {/* Story */}
            <div className="bg-canvas-soft border border-hairline rounded-[8px] p-5">
              <p className="text-xs font-semibold tracking-[2.52px] uppercase text-mute mb-4">
                The Situation
              </p>
              <div className="text-sm text-body leading-6 space-y-3">
                {lesson.storyContext.split("\n\n").map((para, i) => {
                  if (para.startsWith("📩")) {
                    return (
                      <div
                        key={i}
                        className="border border-hairline rounded-[6px] p-3 bg-canvas"
                      >
                        <p className="font-mono text-xs text-canvas-text-soft leading-5">
                          {para}
                        </p>
                      </div>
                    )
                  }
                  return (
                    <p key={i} className="text-body">
                      {para}
                    </p>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Challenge */}
          <div className="border-b border-dashed border-hairline p-8">
            <p className="text-xs font-semibold tracking-[2.52px] uppercase text-mute mb-3">
              Your Challenge
            </p>
            <p className="text-sm text-body leading-6">{lesson.challenge}</p>
          </div>

          {/* Explanation (hidden initially — shown after completion via client) */}
          <LessonExplanation lesson={lesson} />

          {/* Tags */}
          <div className="p-8 border-t border-hairline">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag size={12} className="text-mute" />
              {lesson.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] text-mute border border-hairline rounded-full px-2 py-0.5 font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Code playground */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 p-6 min-h-0">
            <CodePlayground
              starterCode={lesson.starterCode}
              solution={lesson.solution}
              language={module.playground.language}
            />
          </div>

          {/* Lesson navigation */}
          <LessonNav
            techId={techId}
            pathId={pathId}
            prevLesson={prevLesson}
            nextLesson={nextLesson}
          />
        </div>
      </div>

      {/* AI Mentor floating button */}
      <AIMentor
        lessonConcept={lesson.concept}
        lessonTitle={lesson.title}
        challenge={lesson.challenge}
      />
    </div>
  )
}

function LessonExplanation({ lesson }: { lesson: Lesson }) {
  return (
    <div className="p-8 border-b border-dashed border-hairline">
      <p className="text-xs font-semibold tracking-[2.52px] uppercase text-mute mb-4">
        The Explanation
      </p>
      <div className="space-y-4 text-sm text-body leading-6">
        {lesson.explanation.split("\n\n").map((block, i) => {
          if (block.startsWith("```")) {
            const code = block.replace(/```\w*\n?/, "").replace(/```$/, "")
            return (
              <pre
                key={i}
                className="bg-canvas-soft border border-hairline rounded-[8px] p-4 overflow-x-auto"
              >
                <code className="text-xs font-mono text-canvas-text-soft leading-5">
                  {code}
                </code>
              </pre>
            )
          }
          if (block.startsWith("**")) {
            const [header, ...rest] = block.split("\n")
            return (
              <div key={i}>
                <p className="font-semibold text-ink mb-1">
                  {header.replace(/\*\*/g, "")}
                </p>
                {rest.map((line, j) => (
                  <p key={j} className="text-body">
                    {line}
                  </p>
                ))}
              </div>
            )
          }
          return (
            <p key={i} className="text-body">
              {block}
            </p>
          )
        })}
      </div>

      <div className="mt-6 border border-primary/20 bg-primary/5 rounded-[8px] p-4">
        <p className="text-xs font-semibold tracking-[2.52px] uppercase text-primary mb-1">
          Key Takeaway
        </p>
        <p className="text-sm text-ink">{lesson.takeaway}</p>
      </div>
    </div>
  )
}
