import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const SYSTEM_PROMPTS: Record<string, (input: any) => string> = {
  email: (i) => `You are a professional executive communications assistant. Write a clear, well-structured email.

Tone: ${i.tone}
Audience: ${i.audience}
Purpose / context from user:
${i.context}

Output format:
Subject: <concise subject line>

<email body with greeting, 2-4 short paragraphs, and a professional sign-off>

Do not include any commentary outside the email.`,

  meeting: (i) => `You are an expert meeting analyst. Summarize the meeting transcript/notes below into a clean executive brief.

Return strictly this markdown structure:

## Summary
<2-3 sentence overview>

## Key Points
- <bullet>

## Action Items
- <Owner — Action — Deadline (if mentioned)>

## Decisions
- <bullet>

## Open Questions
- <bullet>

Notes:
${i.notes}`,

  tasks: (i) => `You are an AI productivity coach. Convert the user's brain-dump into a prioritized, scheduled plan for ${i.timeframe}.

Use the Eisenhower matrix to prioritize. Output in this markdown format:

## Prioritized Plan (${i.timeframe})

### High Priority (Do First)
1. **Task** — estimated time — suggested time block

### Medium Priority (Schedule)
1. **Task** — estimated time — suggested time block

### Low Priority (Delegate or Defer)
- Task

## Suggested Schedule
| Time | Task |
|------|------|
| 09:00 - 10:00 | ... |

## Coaching Tip
<one short paragraph>

User's tasks:
${i.tasks}`,

  research: (i) => `You are a senior research analyst. Provide a structured briefing on the topic below using your training knowledge. Be concrete and avoid filler.

Topic: ${i.topic}
Depth: ${i.depth}

Return this markdown:

## Executive Summary
<3-4 sentences>

## Key Insights
1. **Insight** — explanation

## Background & Context
<paragraph>

## Opportunities
- <bullet>

## Risks & Considerations
- <bullet>

## Suggested Next Steps
1. ...`,

  chat: () => `You are an AI workplace productivity assistant. Be concise, professional, and actionable. Format with markdown when helpful. If a task could be done by one of these tools, suggest it: Email Generator, Meeting Summarizer, Task Planner, Research Assistant.`,
};

const InputSchema = z.object({
  feature: z.enum(["email", "meeting", "tasks", "research", "chat"]),
  payload: z.record(z.any()).optional().default({}),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .optional()
    .default([]),
});

export const runAI = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "AI is not configured. Missing LOVABLE_API_KEY." };
    }

    const systemPrompt = SYSTEM_PROMPTS[data.feature](data.payload ?? {});

    const messages: Array<{ role: string; content: string }> = [
      { role: "system", content: systemPrompt },
    ];

    if (data.feature === "chat") {
      for (const m of data.messages ?? []) messages.push(m);
    } else {
      messages.push({ role: "user", content: "Generate the requested output now." });
    }

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages,
        }),
      });

      if (res.status === 429) {
        return { ok: false as const, error: "Rate limit reached. Please wait a moment and try again." };
      }
      if (res.status === 402) {
        return { ok: false as const, error: "AI credits exhausted. Add credits in Workspace settings." };
      }
      if (!res.ok) {
        const t = await res.text();
        console.error("AI gateway error", res.status, t);
        return { ok: false as const, error: "The AI service returned an error. Please try again." };
      }

      const json = await res.json();
      const content: string = json.choices?.[0]?.message?.content ?? "";
      return { ok: true as const, content };
    } catch (e) {
      console.error("AI request failed", e);
      return { ok: false as const, error: "Network error contacting AI service." };
    }
  });