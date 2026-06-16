"use client"

import { useState } from "react"
import { ChevronDown, Bookmark, BookmarkCheck } from "lucide-react"
import { useProgressStore } from "@/store/progressStore"
import type { InterviewQuestion } from "@/lib/types"

const difficultyColor: Record<string, string> = {
  beginner: "text-primary border-primary/30",
  intermediate: "text-yellow-400 border-yellow-400/30",
  advanced: "text-orange-400 border-orange-400/30",
}

interface Props {
  questions: InterviewQuestion[]
}

export function InterviewBoard({ questions }: Props) {
  const [filter, setFilter] = useState<string>("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { toggleBookmark, isBookmarked } = useProgressStore()

  const difficulties = ["all", "beginner", "intermediate", "advanced"]

  const filtered =
    filter === "all" ? questions : questions.filter((q) => q.difficulty === filter)

  function toggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center gap-3 mb-8">
        {difficulties.map((d) => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors capitalize ${
              filter === d
                ? "border-primary text-primary bg-primary/10"
                : "border-hairline text-mute hover:text-ink"
            }`}
          >
            {d}
          </button>
        ))}
        <span className="ml-auto text-xs text-mute">
          {filtered.length} question{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {filtered.map((q) => {
          const isExpanded = expandedId === q.id
          const bookmarked = isBookmarked(q.id)

          return (
            <div
              key={q.id}
              className={`border rounded-[8px] overflow-hidden transition-all ${
                isExpanded ? "border-primary/40" : "border-hairline"
              }`}
            >
              {/* Question header */}
              <button
                onClick={() => toggle(q.id)}
                className="w-full flex items-start gap-4 p-5 text-left hover:bg-canvas-soft transition-colors"
              >
                <span
                  className={`text-[10px] font-semibold tracking-widest uppercase border px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${difficultyColor[q.difficulty]}`}
                >
                  {q.difficulty}
                </span>
                <p className="flex-1 text-sm font-medium text-ink leading-5">
                  {q.question}
                </p>
                <ChevronDown
                  size={16}
                  className={`text-mute flex-shrink-0 transition-transform mt-0.5 ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>

              {/* Answer */}
              {isExpanded && (
                <div className="border-t border-hairline">
                  <div className="p-5 space-y-4">
                    <div>
                      <p className="text-xs font-semibold tracking-[2.52px] uppercase text-mute mb-3">
                        Answer
                      </p>
                      <p className="text-sm text-body leading-6">{q.answer}</p>
                    </div>

                    {q.followUps && q.followUps.length > 0 && (
                      <div className="border-t border-dashed border-hairline pt-4">
                        <p className="text-xs font-semibold tracking-[2.52px] uppercase text-mute mb-3">
                          Interviewers often follow up with
                        </p>
                        <ul className="space-y-2">
                          {q.followUps.map((fu, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-body"
                            >
                              <span className="text-primary mt-0.5 flex-shrink-0">
                                →
                              </span>
                              {fu}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex gap-1.5 flex-wrap">
                        {q.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] text-mute border border-hairline rounded-full px-2 py-0.5 font-mono"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleBookmark(q.id)
                        }}
                        className={`flex items-center gap-1.5 text-xs transition-colors px-2 py-1 rounded ${
                          bookmarked
                            ? "text-primary"
                            : "text-mute hover:text-ink"
                        }`}
                      >
                        {bookmarked ? (
                          <BookmarkCheck size={13} />
                        ) : (
                          <Bookmark size={13} />
                        )}
                        {bookmarked ? "Saved" : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
