import Link from "next/link";
import { mockAnime } from "@/lib/mockData";

export default function Home() {
  const featuredAnime = mockAnime.slice(0, 6);

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl">
            Welcome to <span className="text-red-600">AniDojo</span>
          </h1>
          <p className="mb-8 text-lg text-gray-600 sm:text-xl">
            Your ultimate anime tracking and discovery platform
          </p>
          <Link
            href="/browse"
            className="inline-block rounded-lg bg-red-600 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-red-700"
          >
            Browse Anime
          </Link>
        </section>

        {/* Featured Anime Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-semibold text-black">Featured Anime</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {featuredAnime.map((anime, index) => {
              const colors = [
                'bg-gradient-to-br from-red-500 to-red-700',
                'bg-gradient-to-br from-green-500 to-green-700',
                'bg-gradient-to-br from-yellow-400 to-yellow-600',
                'bg-gradient-to-br from-red-500 to-red-700',
                'bg-gradient-to-br from-green-500 to-green-700',
                'bg-gradient-to-br from-yellow-400 to-yellow-600'
              ];
              return (
                <div key={anime.id} className="group overflow-hidden rounded-lg bg-white border-2 border-gray-200 shadow-lg">
                  <div className={`aspect-[2/3] w-full ${colors[index % colors.length]}`} />
                  <div className="p-3">
                    <h3 className="line-clamp-2 text-sm font-medium text-black">{anime.title}</h3>
                    <p className="text-xs text-gray-600">{anime.year}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {anime.genres?.slice(0, 2).map((genre, genreIndex) => (
                        <span
                          key={genreIndex}
                          className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Features Section */}
        <section className="grid gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-red-50 border-2 border-red-200 p-6">
            <h3 className="mb-3 text-xl font-semibold text-red-800">Track Your Progress</h3>
            <p className="text-red-700">
              Keep track of what you're watching, completed shows, and your watchlist.
            </p>
          </div>
          <div className="rounded-lg bg-green-50 border-2 border-green-200 p-6">
            <h3 className="mb-3 text-xl font-semibold text-green-800">Write Reviews</h3>
            <p className="text-green-700">
              Share your thoughts and rate anime to help others discover great shows.
            </p>
          </div>
          <div className="rounded-lg bg-yellow-50 border-2 border-yellow-200 p-6">
            <h3 className="mb-3 text-xl font-semibold text-yellow-800">Create Lists</h3>
            <p className="text-yellow-700">
              Organize your favorite anime into custom lists and share them with friends.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
