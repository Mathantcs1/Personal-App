import { prisma } from "@/lib/prisma";

export type SearchResultType = "sticky_note" | "task" | "work_note" | "meeting" | "personal_note" | "journal" | "bookmark" | "dev_note" | "snippet" | "ai_memory";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  snippet: string;
  url: string;
  updatedAt: Date;
  tags: string[];
}

export async function keywordSearch(query: string, limit = 20): Promise<SearchResult[]> {
  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  const [stickyNotes, tasks, workNotes, meetings, personalNotes, journals, bookmarks, devNotes, snippets, memories] =
    await Promise.all([
      prisma.stickyNote.findMany({ where: { content: { contains: q, mode: "insensitive" } }, include: { tags: true }, take: 5, orderBy: { updatedAt: "desc" } }),
      prisma.task.findMany({ where: { title: { contains: q, mode: "insensitive" } }, include: { tags: true }, take: 5, orderBy: { updatedAt: "desc" } }),
      prisma.workNote.findMany({ where: { title: { contains: q, mode: "insensitive" } }, include: { tags: true }, take: 5, orderBy: { updatedAt: "desc" } }),
      prisma.meeting.findMany({ where: { title: { contains: q, mode: "insensitive" } }, include: { tags: true }, take: 5, orderBy: { updatedAt: "desc" } }),
      prisma.personalNote.findMany({ where: { title: { contains: q, mode: "insensitive" } }, include: { tags: true }, take: 5, orderBy: { updatedAt: "desc" } }),
      prisma.journalEntry.findMany({ include: { tags: true }, take: 10, orderBy: { entryDate: "desc" } }),
      prisma.bookmark.findMany({ where: { OR: [{ title: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }, { url: { contains: q, mode: "insensitive" } }] }, include: { tags: true }, take: 5, orderBy: { updatedAt: "desc" } }),
      prisma.devNote.findMany({ where: { title: { contains: q, mode: "insensitive" } }, include: { tags: true }, take: 5, orderBy: { updatedAt: "desc" } }),
      prisma.snippet.findMany({ where: { OR: [{ title: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }, { code: { contains: q, mode: "insensitive" } }] }, include: { tags: true }, take: 5, orderBy: { updatedAt: "desc" } }),
      prisma.aIMemory.findMany({ where: { content: { contains: q, mode: "insensitive" } }, include: { tags: true }, take: 5, orderBy: { updatedAt: "desc" } }),
    ]);

  for (const n of stickyNotes) {
    results.push({ id: n.id, type: "sticky_note", title: "Sticky Note", snippet: n.content.slice(0, 120), url: "/sticky-notes", updatedAt: n.updatedAt, tags: n.tags.map((t) => t.name) });
  }
  for (const t of tasks) {
    results.push({ id: t.id, type: "task", title: t.title, snippet: t.description?.slice(0, 120) ?? `Status: ${t.status} · Priority: ${t.priority}`, url: "/tasks", updatedAt: t.updatedAt, tags: t.tags.map((t) => t.name) });
  }
  for (const n of workNotes) {
    results.push({ id: n.id, type: "work_note", title: n.title, snippet: "", url: `/work-notes/${n.id}`, updatedAt: n.updatedAt, tags: n.tags.map((t) => t.name) });
  }
  for (const m of meetings) {
    results.push({ id: m.id, type: "meeting", title: m.title, snippet: new Date(m.meetingDate).toLocaleDateString(), url: `/meetings/${m.id}`, updatedAt: m.updatedAt, tags: m.tags.map((t) => t.name) });
  }
  for (const n of personalNotes) {
    results.push({ id: n.id, type: "personal_note", title: n.title, snippet: "", url: `/personal-notes/${n.id}`, updatedAt: n.updatedAt, tags: n.tags.map((t) => t.name) });
  }
  for (const j of journals) {
    const dateStr = new Date(j.entryDate).toISOString().split("T")[0];
    if (j.aiSummary?.toLowerCase().includes(q) || dateStr.includes(q)) {
      results.push({ id: j.id, type: "journal", title: `Journal – ${new Date(j.entryDate).toLocaleDateString()}`, snippet: j.aiSummary?.slice(0, 120) ?? "", url: `/journal/${dateStr}`, updatedAt: j.updatedAt, tags: j.tags.map((t) => t.name) });
    }
  }
  for (const b of bookmarks) {
    results.push({ id: b.id, type: "bookmark", title: b.title, snippet: b.description?.slice(0, 120) ?? b.url, url: "/bookmarks", updatedAt: b.updatedAt, tags: b.tags.map((t) => t.name) });
  }
  for (const n of devNotes) {
    results.push({ id: n.id, type: "dev_note", title: n.title, snippet: "", url: `/dev-notes/${n.id}`, updatedAt: n.updatedAt, tags: n.tags.map((t) => t.name) });
  }
  for (const s of snippets) {
    results.push({ id: s.id, type: "snippet", title: s.title, snippet: s.description ?? s.code.slice(0, 120), url: "/snippets", updatedAt: s.updatedAt, tags: s.tags.map((t) => t.name) });
  }
  for (const m of memories) {
    results.push({ id: m.id, type: "ai_memory", title: `Memory [${m.category}]`, snippet: m.content.slice(0, 120), url: "/ai-memory", updatedAt: m.updatedAt, tags: m.tags.map((t) => t.name) });
  }

  return results.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()).slice(0, limit);
}
