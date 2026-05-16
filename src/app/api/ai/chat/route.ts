import { requireAuth } from "@/lib/auth";
import { chatWithMemories } from "@/lib/claude";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  await requireAuth();
  const { message, history = [] } = await request.json();

  const memories = await prisma.aIMemory.findMany({
    orderBy: { importance: "desc" },
    take: 20,
  });

  const stream = await chatWithMemories(
    message,
    memories.map((m) => ({ content: m.content, category: m.category, importance: m.importance })),
    history
  );

  return new Response(stream, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" },
  });
}
