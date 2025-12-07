'use client';

import { useTopAnime } from '@/hooks/useAnime';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function BrowsePage() {
  const [page, setPage] = useState(1);
  const { data: anime, loading, error, hasNextPage } = useTopAnime(page);

  return (
    <main className="min-h-screen bg-ink text-cream">
      {/* Header */}
      <div className="bg-ink-light border-b border-border-subtle">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center text-cream-muted text-sm gap-2 mb-6">
            <Link href="/dashboard" className="hover:text-cream transition-colors">Home</Link>
            <span>›</span>
            <span className="text-cream">Browse</span>
          </nav>
          
          <h1 className="font-display text-display-lg tracking-wider">TOP ANIME</h1>
          <p className="text-cream-muted mt-2">Discover the highest rated anime of all time</p>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-2 border-crimson border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="card-feature rounded-md p-6 mb-6">
            <p className="text-crimson-bright">Error: {error}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {anime.map((a, index) => (
            <Link 
              href={`/anime/${a.id}`} 
              key={a.id} 
              className={`manga-panel rounded-sm overflow-hidden group animate-slide-up stagger-${Math.min((index % 5) + 1, 5)}`}
            >
              <div className="aspect-[3/4] w-full relative overflow-hidden">
                {/* Rank Badge */}
                <div className="absolute top-2 left-2 z-10 rank-badge text-sm">
                  {(page - 1) * 25 + index + 1}
                </div>
                
                {a.coverArt ? (
                  <Image 
                    src={a.coverArt} 
                    alt={a.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-ink-lighter flex items-center justify-center">
                    <div className="text-center text-cream-muted p-2">
                      <div className="w-12 h-12 bg-surface rounded-sm flex items-center justify-center mx-auto mb-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="text-xs leading-tight line-clamp-2">{a.title}</div>
                    </div>
                  </div>
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-60" />
              </div>
              
              <div className="p-3 bg-ink-light">
                <div className="font-medium text-cream text-sm mb-1 line-clamp-1 group-hover:text-crimson-bright transition-colors">
                  {a.title}
                </div>
                <div className="text-xs text-cream-dark mb-2">{a.year ?? "—"}</div>
                <div className="flex flex-wrap gap-1">
                  {a.genres?.slice(0, 2).map((genre, genreIndex) => (
                    <span
                      key={genreIndex}
                      className="tag text-xs"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {anime.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-secondary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              PREVIOUS
            </button>
            <span className="font-display text-cream-muted">PAGE {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!hasNextPage}
              className="btn-primary px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              NEXT
            </button>
          </div>
        )}

        {anime.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-cream-muted">No anime available.</p>
          </div>
        )}
      </div>
    </main>
  );
}
