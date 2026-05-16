import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const SONNET = "claude-sonnet-4-6";
export const HAIKU = "claude-haiku-4-5-20251001";

export async function generateTags(content: string): Promise<string[]> {
  const msg = await anthropic.messages.create({
    model: HAIKU,
    max_tokens: 100,
    messages: [
      {
        role: "user",
        content: `Suggest 2-5 concise tags for this content. Return only a JSON array of lowercase strings, no explanation.\n\nContent:\n${content.slice(0, 1000)}`,
      },
    ],
  });
  try {
    const text = msg.content[0].type === "text" ? msg.content[0].text : "[]";
    const match = text.match(/\[.*\]/s);
    return match ? JSON.parse(match[0]) : [];
  } catch {
    return [];
  }
}

export async function summarizeJournal(content: string, date: string): Promise<string> {
  const msg = await anthropic.messages.create({
    model: SONNET,
    max_tokens: 200,
    messages: [
      {
        role: "user",
        content: `Write a 2-3 sentence reflective summary of this journal entry from ${date}. Be warm, insightful, and concise.\n\nEntry:\n${content.slice(0, 3000)}`,
      },
    ],
  });
  return msg.content[0].type === "text" ? msg.content[0].text : "";
}

export async function generateDailyPlan(context: {
  tasks: { title: string; priority: string; dueDate?: string | null }[];
  reminders: { title: string; dueAt: string }[];
  meetings: { title: string; meetingDate: string }[];
  memories: { content: string; importance: number }[];
  yesterdayJournal?: string;
  morningNote?: string;
  focusArea?: string;
}): Promise<ReadableStream> {
  const contextText = `
Today's date: ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}

Tasks:
${context.tasks.map((t) => `- [${t.priority}] ${t.title}${t.dueDate ? ` (due: ${t.dueDate})` : ""}`).join("\n") || "None"}

Reminders today:
${context.reminders.map((r) => `- ${r.title} at ${new Date(r.dueAt).toLocaleTimeString()}`).join("\n") || "None"}

Meetings today:
${context.meetings.map((m) => `- ${m.title} at ${new Date(m.meetingDate).toLocaleTimeString()}`).join("\n") || "None"}

Key memories:
${context.memories.slice(0, 5).map((m) => `- ${m.content}`).join("\n") || "None"}

${context.morningNote ? `Morning note: ${context.morningNote}` : ""}
${context.focusArea ? `Focus area: ${context.focusArea}` : ""}
${context.yesterdayJournal ? `Yesterday's journal summary: ${context.yesterdayJournal}` : ""}
`.trim();

  const stream = anthropic.messages.stream({
    model: SONNET,
    max_tokens: 600,
    messages: [
      {
        role: "user",
        content: `You are a personal AI assistant helping plan someone's day. Based on the context below, create a concise, actionable daily plan with prioritized tasks, tips for the day, and a motivating focus statement. Use bullet points and be practical.\n\n${contextText}`,
      },
    ],
  });

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`));
        }
      }
      controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
}

export async function chatWithMemories(
  message: string,
  memories: { content: string; category: string; importance: number }[],
  history: { role: "user" | "assistant"; content: string }[]
): Promise<ReadableStream> {
  const memoriesText = memories
    .sort((a, b) => b.importance - a.importance)
    .map((m) => `[${m.category}] ${m.content}`)
    .join("\n");

  const systemPrompt = `You are a helpful personal AI assistant with access to the user's personal memories and context. Use this information to give personalized, contextual responses.

User's memories:
${memoriesText || "No memories stored yet."}

Be conversational, helpful, and reference relevant memories when appropriate.`;

  const stream = anthropic.messages.stream({
    model: SONNET,
    max_tokens: 1000,
    system: systemPrompt,
    messages: [
      ...history.map((h) => ({ role: h.role, content: h.content })),
      { role: "user", content: message },
    ],
  });

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`));
        }
      }
      controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
}
