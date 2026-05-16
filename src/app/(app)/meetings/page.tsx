import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { format } from "date-fns";
import { Calendar, Plus } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";

export default async function MeetingsPage() {
  await requireAuth();
  const meetings = await prisma.meeting.findMany({
    include: { tags: true, project: true, attendees: true, actionItems: true },
    orderBy: { meetingDate: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Meetings</h1>
        <Button asChild>
          <Link href="/meetings/new"><Plus className="w-4 h-4" /> New Meeting</Link>
        </Button>
      </div>

      {meetings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No meetings"
          description="Log meetings with notes, attendees, and action items."
          action={<Button asChild><Link href="/meetings/new"><Plus className="w-4 h-4" /> Log meeting</Link></Button>}
        />
      ) : (
        <div className="space-y-3">
          {meetings.map((m) => (
            <Link
              key={m.id}
              href={`/meetings/${m.id}`}
              className="flex items-start gap-4 p-4 rounded-xl border bg-card hover:border-primary/30 hover:shadow-sm transition-all group"
            >
              <div className="text-center min-w-[52px]">
                <p className="text-xs text-muted-foreground uppercase">{format(new Date(m.meetingDate), "MMM")}</p>
                <p className="text-2xl font-bold leading-none">{format(new Date(m.meetingDate), "d")}</p>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold group-hover:text-primary transition-colors">{m.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span>{format(new Date(m.meetingDate), "h:mm a")}</span>
                  {m.attendees.length > 0 && <span>{m.attendees.length} attendee{m.attendees.length !== 1 ? "s" : ""}</span>}
                  {m.actionItems.length > 0 && <span>{m.actionItems.filter(a => !a.isCompleted).length} open action{m.actionItems.filter(a => !a.isCompleted).length !== 1 ? "s" : ""}</span>}
                  {m.project && <span>{m.project.name}</span>}
                </div>
                {m.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {m.tags.map((tag) => <span key={tag.id} className="text-xs text-primary/70">#{tag.name}</span>)}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
