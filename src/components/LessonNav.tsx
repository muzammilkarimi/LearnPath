import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Lesson } from "@/lib/types"

interface Props {
  techId: string
  pathId: string
  prevLesson: Lesson | null
  nextLesson: Lesson | null
}

export function LessonNav({ techId, pathId, prevLesson, nextLesson }: Props) {
  return (
    <div className="border-t border-hairline px-6 py-4 flex items-center justify-between">
      {prevLesson ? (
        <Link
          href={`/${techId}/learn/${pathId}/${prevLesson.id}`}
          className="flex items-center gap-2 text-sm text-mute hover:text-ink transition-colors"
        >
          <ChevronLeft size={14} />
          <span className="truncate max-w-[180px]">{prevLesson.title}</span>
        </Link>
      ) : (
        <div />
      )}

      {nextLesson ? (
        <Link
          href={`/${techId}/learn/${pathId}/${nextLesson.id}`}
          className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-soft transition-colors"
        >
          <span className="truncate max-w-[180px]">{nextLesson.title}</span>
          <ChevronRight size={14} />
        </Link>
      ) : (
        <Link
          href={`/${techId}/interview`}
          className="flex items-center gap-2 text-sm font-semibold bg-primary text-on-primary px-4 py-2 rounded-[6px] hover:bg-primary-soft transition-colors"
        >
          Interview Prep <ChevronRight size={14} />
        </Link>
      )}
    </div>
  )
}
