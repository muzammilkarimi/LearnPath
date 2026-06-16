"use client"

import { useState, useCallback, useMemo } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  type Node,
  type Edge,
  BackgroundVariant,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import { useProgressStore } from "@/store/progressStore"
import type { Roadmap, RoadmapNode, NodeStatus } from "@/lib/types"
import { RoadmapNodeCard, type RoadmapNodeData } from "./RoadmapNode"
import { NodePanel } from "./NodePanel"

const nodeTypes = { roadmapNode: RoadmapNodeCard }

interface Props {
  roadmap: Roadmap
}

export function RoadmapGraph({ roadmap }: Props) {
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null)
  const { completedLessons, completedRoadmapNodes, toggleRoadmapNode } = useProgressStore()

  // A node is "done" if its linked lesson is completed OR it was manually marked done
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

  function getStatus(node: RoadmapNode): NodeStatus {
    if (completedSet.has(node.id)) return "completed"
    const allPrereqsDone = node.prerequisites.every((p) => completedSet.has(p))
    return allPrereqsDone ? "available" : "locked"
  }

  const handleNodeClick = useCallback((node: RoadmapNode) => {
    setSelectedNode((prev) => (prev?.id === node.id ? null : node))
  }, [])

  const rfNodes: Node[] = roadmap.nodes.map((node) => ({
    id: node.id,
    type: "roadmapNode",
    position: node.position,
    data: {
      node,
      status: getStatus(node),
      onClick: handleNodeClick,
    } satisfies RoadmapNodeData,
  }))

  const rfEdges: Edge[] = roadmap.edges.map((edge) => ({
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
  }))

  const stats = useMemo(() => {
    const total = roadmap.nodes.length
    const done = roadmap.nodes.filter((n) => completedSet.has(n.id)).length
    const available = roadmap.nodes.filter((n) => getStatus(n) === "available").length
    const totalHours = roadmap.nodes
      .filter((n) => !completedSet.has(n.id))
      .reduce((sum, n) => sum + n.estimatedHours, 0)
    return { total, done, available, totalHours }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roadmap.nodes, completedSet])

  const selectedStatus = selectedNode ? getStatus(selectedNode) : "locked"

  return (
    <div className="flex h-full">
      {/* Graph */}
      <div className="flex-1 relative">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 z-10 px-5 py-3 flex items-center gap-6 bg-canvas/90 backdrop-blur-sm border-b border-hairline">
          <div className="flex-1 h-1 bg-hairline rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(stats.done / stats.total) * 100}%` }}
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
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.3}
          maxZoom={1.5}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnScroll
          className="!bg-canvas"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1}
            color="rgba(255,255,255,0.04)"
          />
          <Controls
            className="!bg-canvas !border-hairline [&>button]:!bg-canvas [&>button]:!border-hairline [&>button]:!text-mute [&>button:hover]:!text-ink [&>button]:!fill-current"
            showInteractive={false}
          />
        </ReactFlow>
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
