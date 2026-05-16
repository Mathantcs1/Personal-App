import { JournalEntryEditor } from "@/components/journal/JournalEntryEditor";

interface Props { params: Promise<{ date: string }> }

export default async function JournalEntryPage({ params }: Props) {
  const { date } = await params;
  return <JournalEntryEditor date={date} />;
}
