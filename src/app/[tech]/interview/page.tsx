import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { getTechModule } from "@/content/registry"
import { InterviewHub } from "@/components/InterviewHub"

interface Props {
  params: Promise<{ tech: string }>
}

export default async function InterviewPage({ params }: Props) {
  const { tech: techId } = await params
  const techModule = getTechModule(techId)
  if (!techModule) notFound()

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
            <Link href={`/${techId}`} className="hover:text-ink transition-colors">
              {techModule.name}
            </Link>
            <ChevronRight size={12} />
            <span className="text-body">Interview Prep</span>
          </div>

          <p className="text-xs font-semibold tracking-[2.52px] uppercase text-primary mb-3">
            Interview Prep
          </p>
          <h1 className="text-[36px] font-normal leading-10 tracking-[-0.9px] text-ink-strong mb-3">
            {techModule.name} Interview Questions
          </h1>
          <p className="text-base text-body max-w-2xl">
            {techModule.interviewQuestions.length} questions — study with flashcards,
            test yourself with the quiz, or browse all answers.
          </p>
        </div>
      </section>

      {/* Mode switcher + content */}
      <section className="px-4 md:px-8 py-10 md:py-12">
        <div className="mx-auto max-w-7xl">
          <InterviewHub questions={techModule.interviewQuestions} />
        </div>
      </section>
    </div>
  )
}
