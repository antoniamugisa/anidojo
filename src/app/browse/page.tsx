import prisma from "@/lib/prisma";

export default async function BrowsePage() {
  const anime = await prisma.anime.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
    select: { id: true, title: true, coverArt: true, year: true },
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-semibold">Browse</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {anime.map((a) => (
          <div key={a.id} className="group overflow-hidden rounded bg-neutral-900">
            <div className="aspect-[2/3] w-full bg-neutral-800" />
            <div className="p-2">
              <div className="line-clamp-1 text-sm font-medium">{a.title}</div>
              <div className="text-xs text-neutral-400">{a.year ?? "—"}</div>
            </div>
          </div>
        ))}
        {anime.length === 0 && (
          <div className="col-span-full text-sm text-neutral-400">
            No anime yet. Seed the database to get started.
          </div>
        )}
      </div>
    </main>
  );
}
