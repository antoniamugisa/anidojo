import { mockAnime } from "@/lib/mockData";

export default function BrowsePage() {
  const anime = mockAnime.slice(0, 30);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 bg-white min-h-screen">
      <h1 className="mb-4 text-2xl font-semibold text-black">Browse Anime</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {anime.map((a, index) => {
          const colors = [
            'bg-gradient-to-br from-red-500 to-red-700',
            'bg-gradient-to-br from-green-500 to-green-700',
            'bg-gradient-to-br from-yellow-400 to-yellow-600',
            'bg-gradient-to-br from-red-500 to-red-700',
            'bg-gradient-to-br from-green-500 to-green-700',
            'bg-gradient-to-br from-yellow-400 to-yellow-600'
          ];
          return (
            <div key={a.id} className="group overflow-hidden rounded-lg bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
              <div className={`aspect-[2/3] w-full ${colors[index % colors.length]}`} />
              <div className="p-3">
                <div className="line-clamp-1 text-sm font-medium text-black">{a.title}</div>
                <div className="text-xs text-gray-600">{a.year ?? "—"}</div>
              </div>
            </div>
          );
        })}
        {anime.length === 0 && (
          <div className="col-span-full text-sm text-gray-500 text-center py-8">
            No anime available.
          </div>
        )}
      </div>
    </main>
  );
}
