"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RotateCcw, Shuffle, ChevronLeft, ChevronRight, ThumbsUp, RefreshCw } from "lucide-react"
import type { InterviewQuestion } from "@/lib/types"

interface Props {
  questions: InterviewQuestion[]
}

type CardStatus = "unseen" | "know" | "review"

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const difficultyColor: Record<string, string> = {
  beginner: "#00d992",
  intermediate: "#facc15",
  advanced: "#f97316",
}

export function FlashCardDeck({ questions }: Props) {
  const [deck, setDeck] = useState<InterviewQuestion[]>(questions)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [statuses, setStatuses] = useState<Record<string, CardStatus>>({})
  const [direction, setDirection] = useState<1 | -1>(1)
  const [finished, setFinished] = useState(false)

  const current = deck[index]
  const knowCount = Object.values(statuses).filter((s) => s === "know").length
  const reviewCount = Object.values(statuses).filter((s) => s === "review").length

  function goTo(next: number, dir: 1 | -1) {
    setDirection(dir)
    setFlipped(false)
    setTimeout(() => setIndex(next), 50)
  }

  function handlePrev() {
    if (index > 0) goTo(index - 1, -1)
  }

  function handleNext() {
    if (index < deck.length - 1) goTo(index + 1, 1)
    else setFinished(true)
  }

  function handleKnow() {
    setStatuses((s) => ({ ...s, [current.id]: "know" }))
    handleNext()
  }

  function handleReview() {
    setStatuses((s) => ({ ...s, [current.id]: "review" }))
    handleNext()
  }

  function handleShuffle() {
    setDeck(shuffle(questions))
    setIndex(0)
    setFlipped(false)
    setStatuses({})
    setFinished(false)
  }

  function handleRestart() {
    setDeck(questions)
    setIndex(0)
    setFlipped(false)
    setStatuses({})
    setFinished(false)
  }

  function handleReviewAgain() {
    const reviewIds = new Set(
      Object.entries(statuses)
        .filter(([, s]) => s === "review")
        .map(([id]) => id)
    )
    const reviewDeck = shuffle(questions.filter((q) => reviewIds.has(q.id)))
    setDeck(reviewDeck)
    setIndex(0)
    setFlipped(false)
    setStatuses({})
    setFinished(false)
  }

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="text-5xl mb-6">
          {knowCount === deck.length ? "🎉" : knowCount > deck.length / 2 ? "💪" : "📚"}
        </div>
        <h3 className="text-2xl font-semibold text-ink-strong mb-2">
          Deck complete!
        </h3>
        <p className="text-body mb-8">
          {deck.length} cards reviewed
        </p>

        <div className="flex gap-8 mb-10">
          <div className="text-center">
            <p className="text-3xl font-mono text-primary">{knowCount}</p>
            <p className="text-xs text-mute mt-1">Got it</p>
          </div>
          <div className="w-px bg-hairline" />
          <div className="text-center">
            <p className="text-3xl font-mono text-yellow-400">{reviewCount}</p>
            <p className="text-xs text-mute mt-1">Review again</p>
          </div>
        </div>

        <div className="flex gap-3">
          {reviewCount > 0 && (
            <button
              type="button"
              onClick={handleReviewAgain}
              className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-5 py-2.5 rounded-[6px] text-sm hover:bg-primary-soft transition-colors"
            >
              <RefreshCw size={14} /> Review {reviewCount} again
            </button>
          )}
          <button
            type="button"
            onClick={handleRestart}
            className="flex items-center gap-2 border border-hairline text-ink px-5 py-2.5 rounded-[6px] text-sm hover:border-mute transition-colors"
          >
            <RotateCcw size={14} /> Start over
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      {/* Controls */}
      <div className="flex items-center justify-between w-full max-w-2xl mb-6">
        <div className="flex items-center gap-4 text-xs text-mute">
          <span className="font-mono">{index + 1} / {deck.length}</span>
          {knowCount > 0 && (
            <span className="text-primary flex items-center gap-1">
              <ThumbsUp size={11} /> {knowCount}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleShuffle}
          className="flex items-center gap-1.5 text-xs text-mute hover:text-ink border border-hairline px-3 py-1.5 rounded-[6px] transition-colors"
        >
          <Shuffle size={11} /> Shuffle
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-2xl h-px bg-hairline mb-8 relative overflow-hidden rounded-full">
        <motion.div
          className="absolute inset-y-0 left-0 bg-primary rounded-full"
          animate={{ width: `${((index) / deck.length) * 100}%` }}
          transition={{ ease: "easeOut", duration: 0.3 }}
        />
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id + "-" + index}
          initial={{ opacity: 0, x: direction * 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -60 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="w-full max-w-2xl"
        >
          {/* 3D flip card */}
          <div
            className="relative cursor-pointer"
            style={{ perspective: "1200px", height: "320px" }}
            onClick={() => setFlipped((f) => !f)}
          >
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
              style={{ transformStyle: "preserve-3d", position: "relative", height: "100%" }}
            >
              {/* Front — question */}
              <div
                style={{ backfaceVisibility: "hidden" }}
                className="absolute inset-0 border border-hairline rounded-[12px] bg-canvas flex flex-col p-8 select-none"
              >
                <div className="flex items-center justify-between mb-6">
                  <span
                    className="text-[10px] font-semibold tracking-[2px] uppercase px-2 py-0.5 rounded-full border"
                    style={{
                      color: difficultyColor[current.difficulty],
                      borderColor: difficultyColor[current.difficulty] + "40",
                    }}
                  >
                    {current.difficulty}
                  </span>
                  <span className="text-[10px] text-mute">Click to flip</span>
                </div>

                <div className="flex-1 flex items-center justify-center">
                  <p className="text-xl font-medium text-ink-strong text-center leading-8">
                    {current.question}
                  </p>
                </div>

                <div className="flex gap-1.5 flex-wrap justify-center mt-4">
                  {current.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] text-mute border border-hairline rounded-full px-2 py-0.5 font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Back — answer */}
              <div
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                className="absolute inset-0 border border-primary/30 rounded-[12px] bg-canvas flex flex-col p-8 select-none"
              >
                <p className="text-[10px] font-semibold tracking-[2px] uppercase text-primary mb-5">
                  Answer
                </p>
                <div className="flex-1 flex items-center">
                  <p className="text-sm text-body leading-6">
                    {current.shortAnswer ?? current.answer}
                  </p>
                </div>
                <p className="text-[10px] text-mute text-center mt-4">
                  Click to flip back
                </p>
              </div>
            </motion.div>
          </div>

          {/* Action buttons — only visible after flip */}
          <AnimatePresence>
            {flipped && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="flex gap-3 mt-6 justify-center"
              >
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleReview() }}
                  className="flex-1 max-w-[180px] py-2.5 rounded-[8px] border border-hairline text-sm text-mute hover:border-yellow-400/50 hover:text-yellow-400 transition-colors"
                >
                  Still learning
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleKnow() }}
                  className="flex-1 max-w-[180px] py-2.5 rounded-[8px] bg-primary/10 border border-primary/30 text-sm text-primary hover:bg-primary/20 transition-colors font-semibold"
                >
                  Got it ✓
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Nav arrows */}
      <div className="flex items-center gap-6 mt-8">
        <button
          type="button"
          onClick={handlePrev}
          disabled={index === 0}
          className="p-2 border border-hairline rounded-[6px] text-mute hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 px-5 py-2 border border-hairline rounded-[6px] text-sm text-mute hover:text-ink transition-colors"
        >
          {index < deck.length - 1 ? (
            <>Next <ChevronRight size={14} /></>
          ) : (
            <>Finish</>
          )}
        </button>
      </div>
    </div>
  )
}
