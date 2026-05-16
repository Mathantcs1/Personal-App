import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { NoteEditor } from "@/components/shared/NoteEditor";

interface Props { params: Promise<{ id: string }> }

export default async function PersonalNoteDetailPage({ params }: Props) {
  await requireAuth();
  const { id } = await params;
  if (id === "new") return <NoteEditor mode="personal" />;
  const note = await prisma.personalNote.findUnique({ where: { id }, include: { tags: true } });
  if (!note) notFound();
  return <NoteEditor mode="personal" note={note} />;
}
