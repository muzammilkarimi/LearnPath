"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, RotateCcw, Trophy } from "lucide-react"
import type { InterviewQuestion } from "@/lib/types"

interface Props {
  questions: InterviewQuestion[]
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const OPTION_LABELS = ["A", "B", "C", "D"]

export function QuizMode({ questions }: Props) {
  const quizPool = useMemo(
    () => shuffle(questions.filter((q) => q.options && q.options.length === 4)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [shuffledOptions, setShuffledOptions] = useState<string[]>(() =>
    shuffle(quizPool[0]?.options ?? [])
  )

  const current = quizPool[index]

  function handleSelect(optionIndex: number) {
    if (selected !== null || !current) return
    setSelected(optionIndex)
    if (shuffledOptions[optionIndex] === current.options![0]) {
      setScore((s) => s + 1)
    }

    setTimeout(() => {
      const next = index + 1
      if (next >= quizPool.length) {
        setFinished(true)
      } else {
        setIndex(next)
        setSelected(null)
        setShuffledOptions(shuffle(quizPool[next].options!))
      }
    }, 1400)
  }

  function handleRestart() {
    const newPool = shuffle(quizPool)
    setIndex(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
    setShuffledOptions(shuffle(newPool[0]?.options ?? []))
  }

  const pct = Math.round((score / quizPool.length) * 100)

  if (quizPool.length === 0) {
    return (
      <div className="text-center py-16 text-mute text-sm">
        No quiz questions available yet.
      </div>
    )
  }

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="text-6xl mb-6"
        >
          {pct === 100 ? "🏆" : pct >= 70 ? "💪" : "📖"}
        </motion.div>

        <h3 className="text-2xl font-semibold text-ink-strong mb-1">
          Quiz complete
        </h3>
        <p className="text-body text-sm mb-8">
          {pct >= 80 ? "Excellent work!" : pct >= 60 ? "Good effort!" : "Keep studying!"}
        </p>

        {/* Score ring */}
        <div className="relative w-32 h-32 mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3d3a39" strokeWidth="2" />
            <motion.circle
              cx="18" cy="18" r="15.9"
              fill="none"
              stroke="#00d992"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="100"
              strokeDashoffset={100}
              animate={{ strokeDashoffset: 100 - pct }}
              transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-2xl font-mono font-semibold text-ink-strong"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {pct}%
            </motion.span>
            <span className="text-[10px] text-mute mt-0.5">
              {score}/{quizPool.length}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRestart}
          className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-6 py-2.5 rounded-[6px] text-sm hover:bg-primary-soft transition-colors"
        >
          <RotateCcw size={14} /> Try again
        </button>
      </motion.div>
    )
  }

  const correctOption = current.options![0]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-mute">
            {index + 1} / {quizPool.length}
          </span>
          <span className="flex items-center gap-1 text-xs text-primary">
            <Trophy size={11} /> {score}
          </span>
        </div>
        <span
          className="text-[10px] font-semibold tracking-widest uppercase text-mute border border-hairline px-2 py-0.5 rounded-full"
        >
          {current.difficulty}
        </span>
      </div>

      {/* Progress */}
      <div className="h-px bg-hairline mb-8 relative overflow-hidden rounded-full">
        <motion.div
          className="absolute inset-y-0 left-0 bg-primary"
          animate={{ width: `${(index / quizPool.length) * 100}%` }}
          transition={{ ease: "easeOut", duration: 0.3 }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.22 }}
        >
          <p className="text-lg font-medium text-ink-strong leading-7 mb-8 min-h-[56px]">
            {current.question}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {shuffledOptions.map((opt, i) => {
              const isCorrect = opt === correctOption
              const isSelected = selected === i
              const showResult = selected !== null

              let borderColor = "border-hairline"
              let bgColor = "bg-canvas"
              let textColor = "text-body"
              let icon = null

              if (showResult) {
                if (isCorrect) {
                  borderColor = "border-primary/60"
                  bgColor = "bg-primary/10"
                  textColor = "text-primary"
                  icon = <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                } else if (isSelected && !isCorrect) {
                  borderColor = "border-red-500/60"
                  bgColor = "bg-red-500/10"
                  textColor = "text-red-400"
                  icon = <XCircle size={16} className="text-red-400 flex-shrink-0" />
                }
              }

              return (
                <motion.button
                  key={opt}
                  type="button"
                  onClick={() => handleSelect(i)}
                  disabled={selected !== null}
                  whileHover={selected === null ? { x: 4 } : {}}
                  whileTap={selected === null ? { scale: 0.99 } : {}}
                  animate={
                    showResult && isCorrect
                      ? { scale: [1, 1.02, 1] }
                      : showResult && isSelected && !isCorrect
                      ? { x: [0, -6, 6, -4, 4, 0] }
                      : {}
                  }
                  transition={{ duration: 0.35 }}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-[8px] border text-left transition-colors ${borderColor} ${bgColor} ${selected === null ? "hover:border-primary/40 hover:bg-canvas-soft cursor-pointer" : "cursor-default"}`}
                >
                  <span
                    className={`w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-[4px] border text-xs font-mono font-semibold transition-colors ${
                      showResult && isCorrect
                        ? "border-primary text-primary"
                        : showResult && isSelected
                        ? "border-red-400 text-red-400"
                        : "border-hairline text-mute"
                    }`}
                  >
                    {OPTION_LABELS[i]}
                  </span>
                  <span className={`text-sm flex-1 ${textColor} transition-colors`}>
                    {opt}
                  </span>
                  {icon}
                </motion.button>
              )
            })}
          </div>

          {/* Post-answer explanation */}
          <AnimatePresence>
            {selected !== null && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="mt-5 border border-hairline rounded-[8px] p-4 bg-canvas-soft">
                  <p className="text-xs font-semibold tracking-[2px] uppercase text-mute mb-2">
                    Explanation
                  </p>
                  <p className="text-sm text-body leading-5">
                    {current.shortAnswer ?? current.answer}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
