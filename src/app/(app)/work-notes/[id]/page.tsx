import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { NoteEditor } from "@/components/shared/NoteEditor";

interface Props { params: Promise<{ id: string }> }

export default async function WorkNoteDetailPage({ params }: Props) {
  await requireAuth();
  const { id } = await params;
  const note = await prisma.workNote.findUnique({ where: { id }, include: { tags: true } });
  if (!note) notFound();
  return <NoteEditor mode="work" note={note} />;
}
