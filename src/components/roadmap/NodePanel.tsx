"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { X, BookOpen, Check, Lock, Clock, Star } from "lucide-react"
import type { RoadmapNode, NodeStatus } from "@/lib/types"

interface Props {
  node: RoadmapNode | null
  status: NodeStatus
  allNodes: RoadmapNode[]
  completedSet: Set<string>
  onClose: () => void
  onToggleDone: () => void
}

const priorityStyle: Record<string, { label: string; color: string }> = {
  essential: { label: "Essential", color: "text-primary border-primary/30 bg-primary/8" },
  "good-to-know": { label: "Good to Know", color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/8" },
  optional: { label: "Optional", color: "text-mute border-hairline bg-canvas-soft" },
}

export function NodePanel({ node, status, allNodes, completedSet, onClose, onToggleDone }: Props) {
  return (
    <AnimatePresence>
      {node && (
        <motion.div
          key={node.id}
          initial={{ x: 340, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 340, opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="fixed right-0 top-14 bottom-0 w-80 border-l border-hairline bg-canvas flex flex-col z-40 shadow-[-20px_0_60px_rgba(0,0,0,0.4)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-hairline">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full border ${priorityStyle[node.priority].color}`}>
                {priorityStyle[node.priority].label}
              </span>
              {status === "completed" && (
                <span className="flex items-center gap-1 text-[10px] text-primary font-semibold">
                  <Check size={10} /> Done
                </span>
              )}
              {status === "locked" && (
                <span className="flex items-center gap-1 text-[10px] text-mute">
                  <Lock size={10} /> Locked
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-mute hover:text-ink transition-colors p-1"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-5 space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-ink-strong mb-2 leading-tight">{node.title}</h2>
                <p className="text-sm text-body leading-6">{node.description}</p>
              </div>

              {/* Why this matters */}
              <div className="border border-primary/20 bg-primary/5 rounded-xl p-4">
                <p className="text-[10px] font-semibold tracking-[2px] uppercase text-primary mb-2">
                  Why this matters
                </p>
                <p className="text-sm text-ink leading-6">{node.why}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-hairline rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock size={12} className="text-mute" />
                  </div>
                  <p className="text-xl font-mono text-primary">{node.estimatedHours}h</p>
                  <p className="text-[10px] text-mute mt-0.5">estimated</p>
                </div>
                <div className="border border-hairline rounded-xl p-3 text-center">
                  <div className="flex gap-0.5 justify-center mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={10}
                        className={i < node.interviewWeight ? "text-primary fill-primary" : "text-hairline"}
                      />
                    ))}
                  </div>
                  <p className="text-xl font-mono text-primary">{node.interviewWeight}/5</p>
                  <p className="text-[10px] text-mute mt-0.5">interview weight</p>
                </div>
              </div>

              {/* Prerequisites */}
              {node.prerequisites.length > 0 && (
                <div>
                  <p className="text-[10px] font-semibold tracking-[2px] uppercase text-mute mb-3">
                    Prerequisites
                  </p>
                  <div className="space-y-2">
                    {node.prerequisites.map((preId) => {
                      const pre = allNodes.find((n) => n.id === preId)
                      const done = completedSet.has(preId)
                      if (!pre) return null
                      return (
                        <div key={preId} className="flex items-center gap-2.5">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${done ? "border-primary bg-primary/10" : "border-hairline"}`}>
                            {done && <Check size={8} className="text-primary" />}
                          </div>
                          <span className={`text-xs ${done ? "text-mute line-through" : "text-body"}`}>
                            {pre.title}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {node.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] text-mute border border-hairline rounded-full px-2 py-0.5 font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Lesson link */}
              {node.linkedLessonPath && (
                <Link
                  href={node.linkedLessonPath}
                  className="flex items-center justify-center gap-2 bg-primary/10 border border-primary/30 text-primary font-semibold py-2.5 rounded-xl text-sm hover:bg-primary/20 transition-colors"
                >
                  <BookOpen size={14} />
                  Go to Lesson
                </Link>
              )}
            </div>
          </div>

          {/* Footer action */}
          <div className="p-4 border-t border-hairline">
            {status === "locked" ? (
              <div className="text-center text-xs text-mute py-2">
                Complete prerequisites first
              </div>
            ) : status === "completed" ? (
              <button
                type="button"
                onClick={onToggleDone}
                className="w-full flex items-center justify-center gap-2 border border-hairline text-mute text-sm py-2.5 rounded-xl hover:border-mute hover:text-ink transition-colors"
              >
                <Check size={14} className="text-primary" /> Completed — mark incomplete
              </button>
            ) : (
              <button
                type="button"
                onClick={onToggleDone}
                className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary font-semibold text-sm py-2.5 rounded-xl hover:bg-primary-soft transition-colors"
              >
                <Check size={14} /> Mark as done
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
