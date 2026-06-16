"use client"

import { useState, useMemo, useCallback } from "react"
import {
  ReactFlow,
  Background,
  Panel,
  MarkerType,
  useReactFlow,
  type Node,
  type Edge,
  type NodeMouseHandler,
  BackgroundVariant,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import { Plus, Minus, Maximize2 } from "lucide-react"
import { useProgressStore } from "@/store/progressStore"
import type { Roadmap, RoadmapNode, NodeStatus } from "@/lib/types"
import { RoadmapNodeCard, type RoadmapNodeData } from "./RoadmapNode"
import { NodePanel } from "./NodePanel"

const nodeTypes = { roadmapNode: RoadmapNodeCard }

function ZoomControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow()
  return (
    <Panel position="bottom-right">
      <div className="flex flex-col border border-hairline rounded-xl bg-canvas overflow-hidden mb-2 mr-2">
        <button
          type="button"
          onClick={() => zoomIn({ duration: 200 })}
          className="p-2.5 text-mute hover:text-ink hover:bg-canvas-soft transition-colors border-b border-hairline"
          aria-label="Zoom in"
        >
          <Plus size={14} />
        </button>
        <button
          type="button"
          onClick={() => zoomOut({ duration: 200 })}
          className="p-2.5 text-mute hover:text-ink hover:bg-canvas-soft transition-colors border-b border-hairline"
          aria-label="Zoom out"
        >
          <Minus size={14} />
        </button>
        <button
          type="button"
          onClick={() => fitView({ duration: 300, padding: 0.2 })}
          className="p-2.5 text-mute hover:text-ink hover:bg-canvas-soft transition-colors"
          aria-label="Fit view"
        >
          <Maximize2 size={13} />
        </button>
      </div>
    </Panel>
  )
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
      if (lessonDone || completedRoadmapNodes[node.id]) {
        s.add(node.id)
      }
    }
    return s
  }, [roadmap.nodes, completedLessons, completedRoadmapNodes])

  const getStatus = useCallback((node: RoadmapNode): NodeStatus => {
    if (completedSet.has(node.id)) return "completed"
    const allPrereqsDone = node.prerequisites.every((p) => completedSet.has(p))
    return allPrereqsDone ? "available" : "locked"
  }, [completedSet])

  const rfNodes: Node[] = useMemo(() => roadmap.nodes.map((node) => ({
    id: node.id,
    type: "roadmapNode",
    position: node.position,
    data: { node, status: getStatus(node) } satisfies RoadmapNodeData,
  })), [roadmap.nodes, getStatus])

  const rfEdges: Edge[] = useMemo(() => roadmap.edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: "smoothstep",
    style: { stroke: "rgba(255,255,255,0.08)", strokeWidth: 1.5 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "rgba(255,255,255,0.12)",
      width: 14,
      height: 14,
    },
  })), [roadmap.edges])

  const stats = useMemo(() => {
    const total = roadmap.nodes.length
    const done = roadmap.nodes.filter((n) => completedSet.has(n.id)).length
    const available = roadmap.nodes.filter((n) => getStatus(n) === "available").length
    const totalHours = roadmap.nodes
      .filter((n) => !completedSet.has(n.id))
      .reduce((sum, n) => sum + n.estimatedHours, 0)
    return { total, done, available, totalHours }
  }, [roadmap.nodes, completedSet, getStatus])

  const handleNodeClick: NodeMouseHandler = useCallback((_, rfNode) => {
    const roadmapNode = roadmap.nodes.find((n) => n.id === rfNode.id)
    if (!roadmapNode) return
    if (getStatus(roadmapNode) === "locked") return
    setSelectedNode((prev) => (prev?.id === roadmapNode.id ? null : roadmapNode))
  }, [roadmap.nodes, getStatus])

  const selectedStatus = selectedNode ? getStatus(selectedNode) : "locked"

  return (
    <div className="flex h-full">
      <div className="flex-1 relative">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 z-10 px-5 py-3 flex items-center gap-6 bg-canvas/90 backdrop-blur-sm border-b border-hairline">
          <div className="flex-1 h-1 bg-hairline rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(stats.done / stats.total) * 100}%` }} /* dynamic progress width */
            />
          </div>
          <div className="flex items-center gap-4 text-xs text-mute shrink-0">
            <span className="text-primary font-semibold font-mono">{stats.done}/{stats.total}</span>
            <span>nodes done</span>
            <span className="text-hairline">·</span>
            <span>~{stats.totalHours}h remaining</span>
            {stats.available > 0 && (
              <>
                <span className="text-hairline">·</span>
                <span className="text-yellow-400">{stats.available} available now</span>
              </>
            )}
          </div>
        </div>

        <ReactFlow
          nodes={rfNodes}
          edges={rfEdges}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.25}
          maxZoom={1.5}
          nodesDraggable={false}
          nodesConnectable={false}
          zoomOnScroll
          zoomOnPinch
          panOnDrag
          preventScrolling={false}
          className="bg-canvas!"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1}
            color="rgba(255,255,255,0.04)"
          />
          <ZoomControls />
        </ReactFlow>
      </div>

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
