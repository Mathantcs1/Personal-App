import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { upsertTags } from "@/lib/tags";
import { fetchUrlMetadata } from "@/lib/url-metadata";

export async function GET() {
  await requireAuth();
  const bookmarks = await prisma.bookmark.findMany({
    include: { tags: true },
    orderBy: [{ isFavorite: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(bookmarks);
}

export async function POST(request: Request) {
  await requireAuth();
  const { url, tags: tagNames = [] } = await request.json();

  const meta = await fetchUrlMetadata(url);
  const tags = await upsertTags(tagNames);

  const bookmark = await prisma.bookmark.create({
    data: {
      url,
      title: meta.title,
      description: meta.description,
      imageUrl: meta.imageUrl,
      favicon: meta.favicon,
      tags: { connect: tags.map((t) => ({ id: t.id })) },
    },
    include: { tags: true },
  });
  return NextResponse.json(bookmark, { status: 201 });
}
