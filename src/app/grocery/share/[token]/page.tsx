import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";

interface Props { params: Promise<{ token: string }> }

export default async function SharedGroceryPage({ params }: Props) {
  const { token } = await params;
  const list = await prisma.groceryList.findUnique({
    where: { shareToken: token },
    include: { items: { orderBy: { position: "asc" } } },
  });
  if (!list) notFound();

  const unchecked = list.items.filter((i) => !i.isChecked);
  const checked = list.items.filter((i) => i.isChecked);

  return (
    <div className="min-h-screen bg-background p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">{list.name}</h1>
      <div className="space-y-1">
        {unchecked.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-2">
            <div className="w-5 h-5 rounded border-2 border-muted-foreground shrink-0" />
            <span>{item.name}</span>
          </div>
        ))}
        {checked.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-2 opacity-50">
            <div className="w-5 h-5 rounded border-2 border-primary bg-primary flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="line-through">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
