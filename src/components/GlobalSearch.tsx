'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Loader2, Clock, X, Play } from 'lucide-react';

interface SearchSuggestion {
  mal_id: number;
  title: string;
  title_english?: string;
  images: {
    jpg: {
      small_image_url: string;
    };
  };
  type?: string;
  year?: number;
}

interface GlobalSearchProps {
  className?: string;
}

export default function GlobalSearch({ className = '' }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Focus search with '/' key
      if (event.key === '/' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        inputRef.current?.focus();
      }
      
      // Close suggestions with Escape
      if (event.key === 'Escape') {
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchAnime = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchQuery)}&limit=5`);
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded');
        }
        throw new Error('Search failed');
      }

      const data = await response.json();
      setSuggestions(data.data || []);
    } catch (error) {
      console.error('Search error:', error);
      setError('Search temporarily unavailable');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setSelectedIndex(-1);

    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce search
    debounceRef.current = setTimeout(() => {
      searchAnime(value);
    }, 300);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length + recentSearches.length ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length + recentSearches.length
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          // Navigate to anime detail
          const anime = suggestions[selectedIndex];
          router.push(`/anime/${anime.mal_id}`);
          setShowSuggestions(false);
          setQuery('');
        } else if (selectedIndex >= suggestions.length && selectedIndex < suggestions.length + recentSearches.length) {
          // Navigate to search page with recent search
          const recentQuery = recentSearches[selectedIndex - suggestions.length];
          router.push(`/search?q=${encodeURIComponent(recentQuery)}`);
          setShowSuggestions(false);
          setQuery('');
        } else if (query.trim()) {
          // Navigate to search page with current query
          router.push(`/search?q=${encodeURIComponent(query)}`);
          setShowSuggestions(false);
          setQuery('');
        }
        break;
    }
  };

  const handleSuggestionClick = (anime: SearchSuggestion) => {
    router.push(`/anime/${anime.mal_id}`);
    setShowSuggestions(false);
    setQuery('');
  };

  const handleRecentSearchClick = (searchQuery: string) => {
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setShowSuggestions(false);
    setQuery('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
      setQuery('');
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const removeRecentSearch = (searchQuery: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newRecentSearches = recentSearches.filter(s => s !== searchQuery);
    setRecentSearches(newRecentSearches);
    localStorage.setItem('searchHistory', JSON.stringify(newRecentSearches));
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search anime..."
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          className="w-full px-4 py-2 pl-10 pr-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {loading && !query && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
          </div>
        )}
      </form>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0 || error) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-sm border border-white/10 rounded-xl shadow-2xl z-50 max-h-[80vh] md:max-h-96 overflow-y-auto w-full md:w-auto min-w-full">
          {/* Error State */}
          {error && (
            <div className="p-4 text-center text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Search Suggestions */}
          {suggestions.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-medium text-gray-400 border-b border-white/10">
                Anime Results
              </div>
              {suggestions.map((anime, index) => (
                <button
                  key={anime.mal_id}
                  onClick={() => handleSuggestionClick(anime)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/5 transition-colors ${
                    selectedIndex === index ? 'bg-red-500/20' : ''
                  }`}
                >
                  <div className="w-12 h-16 rounded overflow-hidden bg-gray-800 flex-shrink-0">
                    <Image
                      src={anime.images.jpg.small_image_url}
                      alt={anime.title}
                      width={48}
                      height={64}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        if (e.currentTarget.nextElementSibling) {
                          (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                    <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                      <Play className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-white line-clamp-1">
                      {anime.title_english || anime.title}
                    </div>
                    <div className="text-sm text-gray-400">
                      {anime.type} {anime.year && `• ${anime.year}`}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-medium text-gray-400 border-b border-white/10">
                Recent Searches
              </div>
              {recentSearches.map((searchQuery, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(searchQuery)}
                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors ${
                    selectedIndex === suggestions.length + index ? 'bg-red-500/20' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-white">{searchQuery}</span>
                  </div>
                  <button
                    onClick={(e) => removeRecentSearch(searchQuery, e)}
                    className="text-gray-400 hover:text-red-400 transition-colors p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </button>
              ))}
            </div>
          )}

          {/* See All Results Link */}
          {query.trim() && (
            <div className="border-t border-white/10">
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                className="block w-full px-4 py-3 text-center text-green-400 hover:bg-white/5 transition-colors"
                onClick={() => setShowSuggestions(false)}
              >
                See all results for "{query}"
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
