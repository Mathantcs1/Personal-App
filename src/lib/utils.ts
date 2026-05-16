import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function tiptapToPlaintext(json: Record<string, unknown>): string {
  if (!json || !json.content) return "";
  const extract = (node: Record<string, unknown>): string => {
    if (node.type === "text") return (node.text as string) || "";
    if (!node.content) return "";
    return (node.content as Record<string, unknown>[]).map(extract).join(" ");
  };
  return (json.content as Record<string, unknown>[]).map(extract).join("\n").trim();
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString();
}

export function formatDateSlug(date: Date): string {
  return date.toISOString().split("T")[0];
}
