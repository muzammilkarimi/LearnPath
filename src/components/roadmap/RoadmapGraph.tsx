"use client"

import React, { useState, useMemo } from "react"
import { Check, Lock, BookOpen } from "lucide-react"
import { useProgressStore } from "@/store/progressStore"
import type { Roadmap, RoadmapNode, NodeStatus } from "@/lib/types"
import { NodePanel } from "./NodePanel"

const NODE_W = 208
const NODE_H = 90

const priorityLabel: Record<string, string> = {
  essential: "essential",
  "good-to-know": "nice to have",
  optional: "optional",
}
const priorityColor: Record<string, string> = {
  essential: "text-primary",
  "good-to-know": "text-yellow-400",
  optional: "text-mute",
}

function edgePath(src: RoadmapNode, tgt: RoadmapNode) {
  const x1 = src.position.x + NODE_W / 2
  const y1 = src.position.y + NODE_H
  const x2 = tgt.position.x + NODE_W / 2
  const y2 = tgt.position.y
  const cy = (y1 + y2) / 2
  return `M ${x1} ${y1} C ${x1} ${cy} ${x2} ${cy} ${x2} ${y2}`
}

interface Props {
  roadmap: Roadmap
}

export function RoadmapGraph({ roadmap }: Props) {
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null)
  const { completedLessons, completedRoadmapNodes, toggleRoadmapNode } = useProgressStore()

  const completedSet = useMemo(() => {
    const s = new Set<string>()
    for (const node of roadmap.nodes) {
      const lessonDone = node.linkedLessonPath
        ? !!completedLessons[node.linkedLessonPath.split("/").pop() ?? ""]
        : false
      if (lessonDone || completedRoadmapNodes[node.id]) s.add(node.id)
    }
    return s
  }, [roadmap.nodes, completedLessons, completedRoadmapNodes])

  function getStatus(node: RoadmapNode): NodeStatus {
    if (completedSet.has(node.id)) return "completed"
    return node.prerequisites.every((p) => completedSet.has(p)) ? "available" : "locked"
  }

  const nodeMap = useMemo(
    () => new Map(roadmap.nodes.map((n) => [n.id, n])),
    [roadmap.nodes]
  )

  const canvasW = Math.max(...roadmap.nodes.map((n) => n.position.x)) + NODE_W + 60
  const canvasH = Math.max(...roadmap.nodes.map((n) => n.position.y)) + NODE_H + 60

  const stats = useMemo(() => {
    const done = roadmap.nodes.filter((n) => completedSet.has(n.id)).length
    const available = roadmap.nodes.filter((n) => getStatus(n) === "available").length
    const hoursLeft = roadmap.nodes
      .filter((n) => !completedSet.has(n.id))
      .reduce((s, n) => s + n.estimatedHours, 0)
    return { total: roadmap.nodes.length, done, available, hoursLeft }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roadmap.nodes, completedSet])

  const selectedStatus = selectedNode ? getStatus(selectedNode) : "locked"

  return (
    <div className="relative">
      {/* Progress bar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-1 bg-hairline rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 w-(--progress)"
            style={{ "--progress": `${(stats.done / stats.total) * 100}%` } as React.CSSProperties}
          />
        </div>
        <div className="flex items-center gap-3 text-xs text-mute shrink-0">
          <span className="font-mono text-primary font-semibold">{stats.done}/{stats.total}</span>
          <span className="text-hairline">·</span>
          <span>~{stats.hoursLeft}h left</span>
          {stats.available > 0 && (
            <>
              <span className="text-hairline">·</span>
              <span className="text-yellow-400">{stats.available} available</span>
            </>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="overflow-x-auto">
        <div
          className="relative w-(--cw) h-(--ch)"
          style={{ "--cw": `${canvasW}px`, "--ch": `${canvasH}px` } as React.CSSProperties}
        >

          {/* SVG edges */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={canvasW}
            height={canvasH}
          >
            <defs>
              <marker
                id="arrow"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M 0 0 L 6 3 L 0 6 Z" fill="rgba(255,255,255,0.18)" />
              </marker>
            </defs>
            {roadmap.edges.map((edge) => {
              const src = nodeMap.get(edge.source)
              const tgt = nodeMap.get(edge.target)
              if (!src || !tgt) return null
              return (
                <path
                  key={edge.id}
                  d={edgePath(src, tgt)}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1.5"
                  fill="none"
                  markerEnd="url(#arrow)"
                />
              )
            })}
          </svg>

          {/* Nodes */}
          {roadmap.nodes.map((node) => {
            const status = getStatus(node)
            const isSelected = selectedNode?.id === node.id

            return (
              <button
                key={node.id}
                type="button"
                disabled={status === "locked"}
                onClick={() =>
                  setSelectedNode((prev) => (prev?.id === node.id ? null : node))
                }
                style={{ "--nx": `${node.position.x}px`, "--ny": `${node.position.y}px` } as React.CSSProperties}
                className={[
                  "absolute w-52 text-left border rounded-xl p-4 transition-all left-(--nx) top-(--ny)",
                  status === "completed"
                    ? "border-primary/50 bg-primary/8"
                    : status === "available"
                      ? isSelected
                        ? "border-primary bg-canvas-soft"
                        : "border-hairline bg-canvas hover:border-primary/50 hover:bg-canvas-soft"
                      : "border-hairline/30 bg-canvas opacity-40 cursor-not-allowed",
                ].join(" ")}
              >
                {/* Priority + dots */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[9px] font-semibold tracking-widest uppercase ${priorityColor[node.priority]}`}>
                    {priorityLabel[node.priority]}
                  </span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-1 rounded-full ${i < node.interviewWeight ? "bg-primary" : "bg-hairline"}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Title */}
                <p className={`text-sm font-semibold leading-tight mb-2 ${status === "completed" ? "text-primary" : "text-ink"}`}>
                  {node.title}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-mute font-mono">{node.estimatedHours}h</span>
                  {status === "completed" && <Check size={12} className="text-primary" />}
                  {status === "locked" && <Lock size={11} className="text-mute" />}
                  {status === "available" && node.linkedLessonPath && (
                    <BookOpen size={11} className="text-primary" />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Node detail panel */}
      {selectedNode && (
        <NodePanel
          node={selectedNode}
          status={selectedStatus}
          allNodes={roadmap.nodes}
          completedSet={completedSet}
          onClose={() => setSelectedNode(null)}
          onToggleDone={() => toggleRoadmapNode(selectedNode.id)}
        />
      )}
    </div>
  )
}
