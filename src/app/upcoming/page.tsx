"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Play } from "lucide-react";

interface Anime {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  status: string;
  episodes?: number;
  synopsis?: string;
  aired?: { from?: string };
}

export default function UpcomingPage() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("https://api.jikan.moe/v4/seasons/now?limit=12");
        const data = await res.json();
        setAnimeList(data.data);
      } catch (err) {
        setError("Failed to load upcoming anime.");
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center text-gray-400 text-sm gap-2">
        <Link href="/dashboard" className="hover:text-white">Home</Link>
        <span className="mx-1">›</span>
        <span className="text-white">Upcoming</span>
      </nav>
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <Calendar className="w-7 h-7 text-red-500" /> Upcoming Anime
      </h1>
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      )}
      {error && (
        <div className="text-center py-20">
          <p className="text-red-400 text-lg">{error}</p>
        </div>
      )}
      {!loading && !error && Array.isArray(animeList) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {animeList.map(anime => (
            <div key={anime.mal_id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-lg flex flex-col">
              <div className="relative aspect-[3/4]">
                <Image
                  src={anime.images.jpg.large_image_url}
                  alt={anime.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={false}
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <h2 className="text-lg font-semibold mb-2 truncate">{anime.title}</h2>
                <p className="text-xs text-gray-400 mb-2 line-clamp-3">{anime.synopsis || "No synopsis available."}</p>
                <div className="flex items-center gap-2 text-sm mb-2">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded">{anime.status}</span>
                  {anime.episodes && (
                    <span className="bg-white/10 text-gray-300 px-2 py-1 rounded">{anime.episodes} eps</span>
                  )}
                  {anime.aired?.from && (
                    <span className="bg-white/10 text-gray-300 px-2 py-1 rounded">{new Date(anime.aired.from).toLocaleDateString()}</span>
                  )}
                </div>
                <Link
                  href={`/anime/${anime.mal_id}`}
                  className="mt-2 inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm justify-center"
                >
                  <Play className="w-4 h-4" /> View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
