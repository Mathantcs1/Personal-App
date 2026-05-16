import { prisma } from "@/lib/prisma";

export function normalizeTag(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export async function upsertTags(names: string[]) {
  const normalized = names.map(normalizeTag).filter(Boolean);
  const tags = await Promise.all(
    normalized.map((name) =>
      prisma.tag.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );
  return tags;
}
