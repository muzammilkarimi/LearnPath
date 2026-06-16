"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { UserProgress } from "@/lib/types"

interface ProgressStore extends UserProgress {
  completeLesson: (lessonId: string) => void
  toggleBookmark: (questionId: string) => void
  setLastVisited: (lessonId: string) => void
  isCompleted: (lessonId: string) => boolean
  isBookmarked: (questionId: string) => boolean
  toggleRoadmapNode: (nodeId: string) => void
  isRoadmapNodeDone: (nodeId: string) => boolean
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      completedLessons: {},
      bookmarkedQuestions: {},
      completedRoadmapNodes: {},
      lastVisited: undefined,

      completeLesson: (lessonId) =>
        set((s) => ({
          completedLessons: { ...s.completedLessons, [lessonId]: true },
        })),

      toggleBookmark: (questionId) =>
        set((s) => ({
          bookmarkedQuestions: {
            ...s.bookmarkedQuestions,
            [questionId]: !s.bookmarkedQuestions[questionId],
          },
        })),

      setLastVisited: (lessonId) => set({ lastVisited: lessonId }),

      isCompleted: (lessonId) => !!get().completedLessons[lessonId],

      isBookmarked: (questionId) => !!get().bookmarkedQuestions[questionId],

      toggleRoadmapNode: (nodeId) =>
        set((s) => ({
          completedRoadmapNodes: {
            ...s.completedRoadmapNodes,
            [nodeId]: !s.completedRoadmapNodes[nodeId],
          },
        })),

      isRoadmapNodeDone: (nodeId) => !!get().completedRoadmapNodes[nodeId],
    }),
    { name: "learnpath-progress" }
  )
)
