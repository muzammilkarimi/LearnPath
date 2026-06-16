"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2, MessageSquare } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface Props {
  lessonConcept: string
  lessonTitle: string
  challenge: string
}

export function AIMentor({ lessonConcept, lessonTitle, challenge }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: `Hey! I'm your mentor for this lesson on **${lessonConcept}**.\n\nI won't give you the answer directly — that's not how real learning works. But I'll ask you the right questions to help you get there.\n\nWhat are you stuck on?`,
        },
      ])
    }
  }, [isOpen, lessonConcept, messages.length])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    const newMessages: Message[] = [...messages, { role: "user", content: text }]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          context: { lessonConcept, lessonTitle, challenge },
        }),
      })

      if (!res.ok) throw new Error("API error")
      const data = await res.json()

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong connecting to the mentor. Try again in a moment.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 flex items-center gap-2 bg-primary text-on-primary font-semibold px-4 py-3 rounded-full shadow-lg hover:bg-primary-soft transition-colors z-50"
      >
        <MessageSquare size={16} />
        Ask Mentor
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-[380px] h-[520px] flex flex-col border border-hairline rounded-[8px] bg-canvas shadow-[0_20px_60px_rgba(0,0,0,0.7)] z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-hairline">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Bot size={12} className="text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold text-ink">AI Mentor</p>
            <p className="text-[10px] text-primary">Online</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-mute hover:text-ink text-xs transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${
                msg.role === "assistant"
                  ? "bg-primary/10 border border-primary/30"
                  : "bg-canvas-soft border border-hairline"
              }`}
            >
              {msg.role === "assistant" ? (
                <Bot size={11} className="text-primary" />
              ) : (
                <User size={11} className="text-mute" />
              )}
            </div>
            <div
              className={`max-w-[80%] px-3 py-2 rounded-[8px] text-sm leading-5 ${
                msg.role === "assistant"
                  ? "bg-canvas-soft text-body border border-hairline"
                  : "bg-primary/10 text-ink border border-primary/20"
              }`}
            >
              {msg.content.split("\n").map((line, j) => (
                <p key={j} className={j > 0 ? "mt-1.5" : ""}>
                  {line.replace(/\*\*(.*?)\*\*/g, "$1")}
                </p>
              ))}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5">
            <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Bot size={11} className="text-primary" />
            </div>
            <div className="bg-canvas-soft border border-hairline px-3 py-2 rounded-[8px]">
              <Loader2 size={13} className="text-primary animate-spin" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-hairline p-3">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your mentor..."
            rows={1}
            className="flex-1 bg-canvas-soft border border-hairline rounded-[6px] px-3 py-2 text-sm text-ink placeholder:text-mute resize-none outline-none focus:border-primary/50 transition-colors"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="bg-primary text-on-primary p-2 rounded-[6px] hover:bg-primary-soft transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send size={14} />
          </button>
        </div>
        <p className="text-[10px] text-mute mt-1.5 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
