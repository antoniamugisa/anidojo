'use client';

import { useTopAnime } from '@/hooks/useAnime';
import { useState } from 'react';
import Image from 'next/image';

export default function BrowsePage() {
  const [page, setPage] = useState(1);
  const { data: anime, loading, error, hasNextPage } = useTopAnime(page);

  const getAnimeColor = (index: number) => {
    const colors = [
      'bg-gradient-to-br from-red-500 to-red-700',
      'bg-gradient-to-br from-green-500 to-green-700',
      'bg-gradient-to-br from-yellow-400 to-yellow-600',
    ];
    return colors[index % colors.length];
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 bg-white min-h-screen">
      <h1 className="mb-6 text-3xl font-bold text-gray-900 uppercase tracking-wide">Top Anime</h1>
      
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">Error: {error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {anime.map((a, index) => (
          <div key={a.id} className="group overflow-hidden rounded-lg bg-white border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
            <div className={`aspect-[2/3] w-full ${getAnimeColor(index)} flex items-center justify-center relative`}>
              {a.coverArt ? (
                <Image 
                  src={a.coverArt} 
                  alt={a.title}
                  width={200}
                  height={300}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-white p-2">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-xs font-medium leading-tight">{a.title}</div>
                </div>
              )}
            </div>
            <div className="p-3">
              <div className="line-clamp-1 text-sm font-medium text-black mb-1">{a.title}</div>
              <div className="text-xs text-gray-600 mb-2">{a.year ?? "—"}</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {a.genres?.slice(0, 2).map((genre, genreIndex) => (
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
        ))}
      </div>

      {/* Pagination */}
      {anime.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
          >
            Previous
          </button>
          <span className="text-gray-600">Page {page}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!hasNextPage}
            className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700 transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {anime.length === 0 && !loading && (
        <div className="col-span-full text-sm text-gray-500 text-center py-8">
          No anime available.
        </div>
      )}
    </main>
  );
}
