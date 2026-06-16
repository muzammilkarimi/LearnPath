"use client"

import { useRef, useState } from "react"
import Editor, { type OnMount } from "@monaco-editor/react"
import { Check, RotateCcw, Eye, EyeOff } from "lucide-react"
import type * as Monaco from "monaco-editor"

interface Props {
  starterCode: string
  solution: string
  language?: string
  onComplete?: () => void
}

export function CodePlayground({
  starterCode,
  solution,
  language = "javascript",
  onComplete,
}: Props) {
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null)
  const [showSolution, setShowSolution] = useState(false)
  const [completed, setCompleted] = useState(false)

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor
  }

  function setEditorValue(value: string) {
    editorRef.current?.setValue(value)
  }

  function handleReset() {
    setEditorValue(starterCode)
    setShowSolution(false)
    setCompleted(false)
  }

  function handleRevealSolution() {
    setEditorValue(solution)
    setShowSolution(true)
    if (!completed) {
      setCompleted(true)
      onComplete?.()
    }
  }

  function handleHideSolution() {
    setEditorValue(starterCode)
    setShowSolution(false)
  }

  function handleMarkComplete() {
    setCompleted(true)
    onComplete?.()
  }

  return (
    <div className="flex flex-col h-full border border-hairline rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-hairline bg-canvas-soft">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-3 text-xs text-mute font-mono">
            {showSolution ? "solution.jsx" : "challenge.jsx"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-mute hover:text-ink px-2 py-1 rounded transition-colors"
          >
            <RotateCcw size={11} />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            type="button"
            onClick={showSolution ? handleHideSolution : handleRevealSolution}
            className="flex items-center gap-1.5 text-xs text-mute hover:text-primary px-2 py-1 rounded border border-hairline transition-colors"
          >
            {showSolution ? (
              <>
                <EyeOff size={11} /> <span className="hidden sm:inline">Hide Solution</span>
              </>
            ) : (
              <>
                <Eye size={11} /> <span className="hidden sm:inline">Show Solution</span>
              </>
            )}
          </button>

          {completed ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Check size={12} /> <span className="hidden sm:inline">Completed</span>
            </span>
          ) : (
            <button
              onClick={handleMarkComplete}
              className="flex items-center gap-1.5 text-xs font-semibold bg-primary text-on-primary px-3 py-1.5 rounded-md hover:bg-primary-soft transition-colors"
            >
              <Check size={11} /> <span className="hidden sm:inline">Mark Done</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language}
          defaultValue={starterCode}
          onMount={handleMount}
          theme="vs-dark"
          options={{
            fontSize: 13,
            fontFamily:
              "SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
            lineHeight: 20,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            renderLineHighlight: "none",
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            scrollbar: {
              vertical: "auto",
              horizontal: "hidden",
              verticalScrollbarSize: 6,
            },
            wordWrap: "on",
            tabSize: 2,
          }}
        />
      </div>
    </div>
  )
}
