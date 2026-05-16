"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, FileText, CheckSquare, Briefcase, Calendar, BookOpen, BookMarked, Code2, Scissors, Brain, Pin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  type: string;
  title: string;
  snippet: string;
  url: string;
  updatedAt: string;
  tags: string[];
}

const typeIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  sticky_note: Pin,
  task: CheckSquare,
  work_note: Briefcase,
  meeting: Calendar,
  personal_note: BookOpen,
  journal: BookMarked,
  bookmark: BookMarked,
  dev_note: Code2,
  snippet: Scissors,
  ai_memory: Brain,
};

const typeLabel: Record<string, string> = {
  sticky_note: "Sticky Note", task: "Task", work_note: "Work Note",
  meeting: "Meeting", personal_note: "Personal Note", journal: "Journal",
  bookmark: "Bookmark", dev_note: "Dev Note", snippet: "Snippet", ai_memory: "AI Memory",
};

const typeColor: Record<string, string> = {
  sticky_note: "text-yellow-500", task: "text-blue-500", work_note: "text-indigo-500",
  meeting: "text-purple-500", personal_note: "text-green-500", journal: "text-orange-500",
  bookmark: "text-pink-500", dev_note: "text-cyan-500", snippet: "text-red-500", ai_memory: "text-violet-500",
};

const FILTERS = ["all", "sticky_note", "task", "work_note", "meeting", "personal_note", "journal", "bookmark", "dev_note", "snippet", "ai_memory"];

export function SearchPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    const res = await fetch(`/api/ai/search?q=${encodeURIComponent(q)}`);
    if (res.ok) setResults(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { search(query); }, 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  const filtered = filter === "all" ? results : results.filter((r) => r.type === filter);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Search className="w-5 h-5 text-muted-foreground shrink-0" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search everything..."
          className="text-lg h-11"
          autoFocus
        />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-colors",
              filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {f === "all" ? "All" : typeLabel[f]}
          </button>
        ))}
      </div>

      {loading && <p className="text-sm text-muted-foreground">Searching...</p>}

      {!loading && query && filtered.length === 0 && (
        <p className="text-sm text-muted-foreground">No results for &quot;{query}&quot;</p>
      )}

      {!loading && !query && (
        <p className="text-sm text-muted-foreground">Type to search across all your notes, tasks, journal entries, and more.</p>
      )}

      <div className="space-y-2">
        {filtered.map((result) => {
          const Icon = typeIcon[result.type] ?? FileText;
          return (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => router.push(result.url)}
              className="w-full text-left flex items-start gap-3 p-4 rounded-xl border bg-card hover:border-primary/30 hover:shadow-sm transition-all group"
            >
              <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", typeColor[result.type])} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={cn("text-xs font-medium", typeColor[result.type])}>{typeLabel[result.type]}</span>
                  <span className="text-xs text-muted-foreground">{formatRelativeTime(result.updatedAt)}</span>
                </div>
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{result.title}</p>
                {result.snippet && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{result.snippet}</p>}
                {result.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {result.tags.map((tag) => <span key={tag} className="text-xs text-primary/60">#{tag}</span>)}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
