'use client';

import { useState } from 'react';
import { useAnimeSearch } from '@/hooks/useAnime';
import Image from 'next/image';

export default function AnimeSearch() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const { data: anime, loading, error, hasNextPage } = useAnimeSearch(query, page);

  const getAnimeColor = (index: number) => {
    const colors = [
      'bg-gradient-to-br from-red-500 to-red-700',
      'bg-gradient-to-br from-green-500 to-green-700',
      'bg-gradient-to-br from-yellow-400 to-yellow-600',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for anime..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1); // Reset to first page on new search
            }}
            className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none text-lg"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-500"></div>
            ) : (
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">Error: {error}</p>
        </div>
      )}

      {/* Results */}
      {query && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Search Results for "{query}"
            {anime.length > 0 && (
              <span className="text-sm font-normal text-gray-600 ml-2">
                ({anime.length} results)
              </span>
            )}
          </h2>

          {anime.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No anime found for "{query}"
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
                  <h3 className="line-clamp-2 text-sm font-medium text-black mb-1">{a.title}</h3>
                  <p className="text-xs text-gray-600 mb-2">{a.year}</p>
                  <div className="flex flex-wrap gap-1">
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
        </div>
      )}
    </div>
  );
}
