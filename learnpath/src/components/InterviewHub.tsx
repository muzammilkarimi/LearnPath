"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LayoutList, Layers, Zap } from "lucide-react"
import { InterviewBoard } from "./InterviewBoard"
import { FlashCardDeck } from "./FlashCardDeck"
import { QuizMode } from "./QuizMode"
import type { InterviewQuestion } from "@/lib/types"

type Mode = "browse" | "flashcards" | "quiz"

const modes: { id: Mode; label: string; icon: typeof Zap; description: string }[] = [
  {
    id: "browse",
    label: "Browse",
    icon: LayoutList,
    description: "Read all Q&A at your own pace",
  },
  {
    id: "flashcards",
    label: "Flashcards",
    icon: Layers,
    description: "Flip cards — mark what you know",
  },
  {
    id: "quiz",
    label: "Quiz",
    icon: Zap,
    description: "Multiple choice with instant feedback",
  },
]

export function InterviewHub({ questions }: { questions: InterviewQuestion[] }) {
  const [mode, setMode] = useState<Mode>("browse")

  return (
    <div>
      {/* Mode tabs */}
      <div className="flex gap-3 mb-10">
        {modes.map((m) => {
          const Icon = m.icon
          const active = mode === m.id
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-[8px] border text-sm transition-all ${
                active
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-hairline text-mute hover:text-ink hover:border-mute"
              }`}
            >
              <Icon size={14} />
              <span className="font-medium">{m.label}</span>
            </button>
          )
        })}

        <p className="ml-auto self-center text-xs text-mute hidden md:block">
          {modes.find((m) => m.id === mode)?.description}
        </p>
      </div>

      {/* Mode content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          {mode === "browse" && <InterviewBoard questions={questions} />}
          {mode === "flashcards" && <FlashCardDeck questions={questions} />}
          {mode === "quiz" && <QuizMode questions={questions} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
