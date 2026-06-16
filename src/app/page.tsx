import Link from "next/link"
import { ArrowRight, BookOpen, Code2, MessageSquare, Zap } from "lucide-react"
import { techModules } from "@/content/registry"
import type { TechModule } from "@/lib/types"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Hero */}
      <section className="border-b border-hairline px-4 md:px-8 py-14 md:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[2.52px] uppercase text-primary mb-6">
            Story-Based Learning
          </p>
          <h1 className="text-[38px] md:text-[60px] font-normal leading-tight md:leading-[60px] tracking-[-0.65px] text-ink-strong max-w-3xl mb-6">
            Learn to code the way real devs do it.
          </h1>
          <p className="text-base md:text-lg text-body max-w-2xl mb-8 md:mb-10 leading-7">
            No more &quot;hello world&quot; tutorials. Every concept is taught
            through a real workplace situation — bugs to fix, deadlines to meet,
            and a PM breathing down your neck. Just like the job.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Link
              href="/react/learn/beginner"
              className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-5 py-3 rounded-md text-base hover:bg-primary-soft transition-colors"
            >
              Start with React <ArrowRight size={16} />
            </Link>
            <Link
              href="/react/interview"
              className="flex items-center gap-2 border border-hairline text-ink font-semibold px-5 py-3 rounded-md text-base hover:border-mute transition-colors"
            >
              Interview Prep
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-dashed border-hairline px-4 md:px-8 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[2.52px] uppercase text-mute mb-10">
            How it works
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Enter the story",
                body: "You are a developer at a fictional company. Your PM sends you a ticket. The situation creates the need — the concept fills the need.",
              },
              {
                icon: Code2,
                title: "Fix real code",
                body: "Work in a live code playground. The code is broken in real ways — infinite loops, prop drilling, stale closures. Fix it to progress.",
              },
              {
                icon: MessageSquare,
                title: "Ask your mentor",
                body: "Stuck? Your AI mentor does not give you the answer — it asks you questions back until you find it yourself. Socratic method, not a hint button.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="border border-hairline rounded-[8px] p-6 bg-canvas hover:shadow-[0_0_15px_rgba(92,88,85,0.2)] transition-shadow"
              >
                <div className="w-8 h-8 flex items-center justify-center rounded-[6px] border border-hairline mb-4">
                  <Icon size={15} className="text-primary" />
                </div>
                <h3 className="text-base font-semibold text-ink mb-2">
                  {title}
                </h3>
                <p className="text-sm text-body leading-5">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech modules */}
      <section className="px-4 md:px-8 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold tracking-[2.52px] uppercase text-mute mb-3">
                Technologies
              </p>
              <h2 className="text-[36px] font-normal leading-10 tracking-[-0.9px] text-ink-strong">
                Choose your path
              </h2>
            </div>
            <p className="text-sm text-mute pb-1">More coming soon</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {techModules.map((tech) => (
              <TechCard key={tech.id} tech={tech} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t border-dashed border-hairline px-4 md:px-8 py-10 md:py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
            {[
              { value: "15", label: "Lessons available" },
              { value: "36", label: "Interview questions" },
              { value: "1", label: "AI mentor" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-[40px] font-normal text-primary font-mono tracking-tight">
                  {value}
                </p>
                <p className="text-sm text-body mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-hairline px-4 md:px-8 py-8 md:py-10">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-primary" fill="currentColor" />
            <span className="text-sm font-semibold text-ink">LearnPath</span>
          </div>
          <p className="text-xs text-mute">
            Built for developers who learn by doing.
          </p>
        </div>
      </footer>
    </div>
  )
}

function TechCard({ tech }: { tech: TechModule }) {
  const inner = (
    <>
      <div className="text-2xl mb-3">{tech.icon}</div>
      <h3 className="text-base font-semibold text-ink mb-1">{tech.name}</h3>
      <p className="text-sm text-body leading-5 mb-4">{tech.tagline}</p>
      <div className="flex flex-wrap gap-1">
        {tech.tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] text-mute border border-hairline rounded-full px-2 py-0.5"
          >
            {tag}
          </span>
        ))}
      </div>
    </>
  )

  if (tech.comingSoon) {
    return (
      <div className="relative border border-hairline rounded-[8px] p-6 bg-canvas opacity-50 cursor-not-allowed">
        {inner}
        <span className="absolute top-3 right-3 text-[10px] font-semibold tracking-widest uppercase text-mute border border-hairline rounded-full px-2 py-0.5">
          Soon
        </span>
      </div>
    )
  }

  return (
    <Link
      href={`/${tech.id}`}
      className="block border border-hairline rounded-[8px] p-6 bg-canvas hover:border-primary hover:shadow-[0_0_15px_rgba(92,88,85,0.2)] transition-all"
    >
      {inner}
    </Link>
  )
}
