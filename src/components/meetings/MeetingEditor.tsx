"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Trash2, Plus, X, CheckSquare } from "lucide-react";
import { format } from "date-fns";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { TagInput } from "@/components/shared/TagInput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAutoSave } from "@/hooks/useAutoSave";
import { MicButton } from "@/components/shared/MicButton";

interface ActionItem { id: string; text: string; isCompleted: boolean }
interface Attendee { id: string; name: string }

interface MeetingData {
  id: string;
  title: string;
  meetingDate: string | Date;
  notes: Record<string, unknown>;
  tags: { id: string; name: string }[];
  attendees: Attendee[];
  actionItems: ActionItem[];
}

interface MeetingEditorProps { meeting?: MeetingData }

export function MeetingEditor({ meeting }: MeetingEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(meeting?.title ?? "");
  const [meetingDate, setMeetingDate] = useState(
    meeting?.meetingDate
      ? format(new Date(meeting.meetingDate), "yyyy-MM-dd'T'HH:mm")
      : format(new Date(), "yyyy-MM-dd'T'HH:mm")
  );
  const [notes, setNotes] = useState<Record<string, unknown>>((meeting?.notes as Record<string, unknown>) ?? {});
  const [tags, setTags] = useState<{ name: string }[]>(meeting?.tags.map((t) => ({ name: t.name })) ?? []);
  const [attendees, setAttendees] = useState<string[]>(meeting?.attendees.map((a) => a.name) ?? []);
  const [attendeeInput, setAttendeeInput] = useState("");
  const [actionItems, setActionItems] = useState<ActionItem[]>(meeting?.actionItems ?? []);
  const [actionInput, setActionInput] = useState("");
  const [meetingId, setMeetingId] = useState(meeting?.id ?? null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(!!meeting);

  const save = useCallback(
    async (data: { title: string; notes: Record<string, unknown> }) => {
      if (!data.title.trim()) return;
      setSaving(true);
      const url = meetingId ? `/api/meetings/${meetingId}` : "/api/meetings";
      const method = meetingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, meetingDate, tags: tags.map((t) => t.name), attendees }),
      });
      if (res.ok) {
        const saved = await res.json();
        if (!meetingId) { setMeetingId(saved.id); router.replace(`/meetings/${saved.id}`); }
        setSaved(true);
      }
      setSaving(false);
    },
    [meetingId, meetingDate, tags, attendees, router]
  );

  useAutoSave({ title, notes }, save, 1500);

  async function handleDelete() {
    if (!meetingId || !confirm("Delete this meeting?")) return;
    await fetch(`/api/meetings/${meetingId}`, { method: "DELETE" });
    toast.success("Meeting deleted");
    router.push("/meetings");
  }

  function addAttendee() {
    const name = attendeeInput.trim();
    if (name && !attendees.includes(name)) setAttendees((p) => [...p, name]);
    setAttendeeInput("");
  }

  async function addActionItem() {
    const text = actionInput.trim();
    if (!text || !meetingId) return;
    const res = await fetch(`/api/meetings/${meetingId}/action-items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (res.ok) { const item = await res.json(); setActionItems((p) => [...p, item]); }
    setActionInput("");
  }

  async function toggleActionItem(item: ActionItem) {
    if (!meetingId) return;
    const res = await fetch(`/api/meetings/${meetingId}/action-items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isCompleted: !item.isCompleted }),
    });
    if (res.ok) setActionItems((p) => p.map((a) => a.id === item.id ? { ...a, isCompleted: !a.isCompleted } : a));
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/meetings")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-muted-foreground">{saving ? "Saving..." : saved ? "Saved" : ""}</span>
          {meetingId && (
            <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Meeting title"
            className="text-2xl font-bold border-0 shadow-none px-0 focus-visible:ring-0 h-auto"
          />
          <MicButton onTranscript={(t) => setTitle((p) => p + t)} />
        </div>

        <div>
          <Label>Date & Time</Label>
          <input
            type="datetime-local"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
            className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div>
          <Label>Attendees</Label>
          <div className="flex gap-2 mt-1">
            <Input
              value={attendeeInput}
              onChange={(e) => setAttendeeInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAttendee())}
              placeholder="Add attendee name"
            />
            <Button type="button" variant="outline" size="icon" onClick={addAttendee}><Plus className="w-4 h-4" /></Button>
          </div>
          {attendees.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {attendees.map((a) => (
                <span key={a} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-muted">
                  {a}
                  <button onClick={() => setAttendees((p) => p.filter((x) => x !== a))}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <Label>Tags</Label>
          <TagInput tags={tags} onChange={setTags} className="mt-1" />
        </div>

        <div>
          <Label>Notes</Label>
          <div className="mt-1">
            <RichTextEditor content={notes} onChange={setNotes} placeholder="Meeting notes..." />
          </div>
        </div>

        {meetingId && (
          <div>
            <Label>Action Items</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={actionInput}
                onChange={(e) => setActionInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addActionItem())}
                placeholder="Add action item"
              />
              <Button type="button" variant="outline" size="icon" onClick={addActionItem}><Plus className="w-4 h-4" /></Button>
            </div>
            {actionItems.length > 0 && (
              <div className="space-y-1 mt-2">
                {actionItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleActionItem(item)}
                    className="flex items-center gap-2 w-full text-left text-sm p-2 rounded hover:bg-accent transition-colors"
                  >
                    <CheckSquare className={`w-4 h-4 shrink-0 ${item.isCompleted ? "text-green-500" : "text-muted-foreground"}`} />
                    <span className={item.isCompleted ? "line-through text-muted-foreground" : ""}>{item.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
