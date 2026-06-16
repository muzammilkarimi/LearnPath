"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Check, Lock, BookOpen } from "lucide-react"
import type { RoadmapNode as RoadmapNodeType, NodeStatus } from "@/lib/types"

export type RoadmapNodeData = {
  node: RoadmapNodeType
  status: NodeStatus
  onClick: (node: RoadmapNodeType) => void
}

const priorityLabel: Record<string, string> = {
  essential: "essential",
  "good-to-know": "nice to have",
  optional: "optional",
}

const priorityStyle: Record<string, string> = {
  essential: "text-primary",
  "good-to-know": "text-yellow-400",
  optional: "text-mute",
}

export function RoadmapNodeCard({ data }: NodeProps) {
  const { node, status, onClick } = data as RoadmapNodeData

  return (
    <div
      onClick={() => status !== "locked" && onClick(node)}
      className={[
        "w-52 border rounded-xl p-4 transition-all select-none",
        status === "completed"
          ? "border-primary/60 bg-primary/8 cursor-pointer"
          : status === "available"
            ? "border-hairline hover:border-primary/50 hover:bg-canvas-soft cursor-pointer"
            : "border-hairline/40 opacity-40 cursor-not-allowed",
      ].join(" ")}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-hairline !border-0 !top-[-5px]"
      />

      {/* Priority + interview weight */}
      <div className="flex items-center justify-between mb-2.5">
        <span className={`text-[9px] font-semibold tracking-widest uppercase ${priorityStyle[node.priority]}`}>
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
      <p className={`text-sm font-semibold mb-2.5 leading-tight ${status === "completed" ? "text-primary" : "text-ink"}`}>
        {node.title}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-mute font-mono">{node.estimatedHours}h</span>
        <div className="flex items-center gap-1.5">
          {node.linkedLessonPath && status === "available" && (
            <BookOpen size={11} className="text-primary" />
          )}
          {status === "completed" && <Check size={12} className="text-primary" />}
          {status === "locked" && <Lock size={11} className="text-mute" />}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-hairline !border-0 !bottom-[-5px]"
      />
    </div>
  )
}
