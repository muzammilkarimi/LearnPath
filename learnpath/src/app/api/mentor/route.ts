import Anthropic from "@anthropic-ai/sdk"
import { NextResponse } from "next/server"

const client = new Anthropic()

const SYSTEM_PROMPT = `You are a senior developer mentor helping a developer learn through a story-based lesson.

Your rules:
1. NEVER give the direct answer or write the solution code for them
2. Use the Socratic method — ask questions that guide them toward the answer
3. If they're stuck, give a small nudge in the right direction, not the solution
4. Be encouraging but direct — real devs don't sugarcoat things
5. Keep responses SHORT (2-4 sentences max). This is a chat, not a lecture
6. Reference the lesson context when relevant
7. If they figure it out themselves, celebrate it briefly and reinforce the mental model
8. Use code snippets ONLY to illustrate a concept, never to show the answer

Tone: like a patient senior developer at a code review — direct, encouraging, and brief.`

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages, context } = body

    const contextNote = `
Current lesson: "${context.lessonTitle}"
Concept being taught: ${context.lessonConcept}
Challenge: ${context.challenge}
`

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      system: SYSTEM_PROMPT + "\n\nLesson context:\n" + contextNote,
      messages: messages.map(
        (m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })
      ),
    })

    const content =
      response.content[0].type === "text" ? response.content[0].text : ""

    return NextResponse.json({ content })
  } catch (error) {
    console.error("Mentor API error:", error)
    return NextResponse.json(
      { error: "Failed to get mentor response" },
      { status: 500 }
    )
  }
}
