'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  Grid3X3, 
  List, 
  Star, 
  Play, 
  Plus, 
  Eye, 
  Calendar, 
  Clock, 
  Users, 
  Award, 
  TrendingUp, 
  History, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  SearchX,
  Mic,
  MicOff,
  Download,
  Share2,
  Bell,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

// Types
interface Anime {
  mal_id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  genres: Array<{
    mal_id: number;
    name: string;
  }>;
  score?: number;
  scored_by?: number;
  status: string;
  type?: string;
  episodes?: number;
  duration?: string;
  rating?: string;
  year?: number;
  synopsis?: string;
  popularity?: number;
  rank?: number;
  studios: Array<{
    mal_id: number;
    name: string;
  }>;
  producers: Array<{
    mal_id: number;
    name: string;
  }>;
  aired: {
    from: string;
    to?: string;
  };
}

interface SearchFilters {
  type: string[];
  status: string[];
  rating: string[];
  year: string;
  genres: string[];
  excludeGenres: string[];
  scoreRange: [number, number];
  popularityRange: [number, number];
  episodeRange: [number, number];
  startDate: string;
  endDate: string;
  studio: string;
  producer: string;
  orderBy: string;
  sort: 'asc' | 'desc';
}

interface SearchResult {
  data: Anime[];
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [availableGenres, setAvailableGenres] = useState<Array<{ mal_id: number; name: string }>>([]);
  const [studios, setStudios] = useState<Array<{ mal_id: number; name: string }>>([]);
  const [producers, setProducers] = useState<Array<{ mal_id: number; name: string }>>([]);
  const [isVoiceSearching, setIsVoiceSearching] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<SearchFilters>({
    type: [],
    status: [],
    rating: [],
    year: '',
    genres: [],
    excludeGenres: [],
    scoreRange: [0, 10],
    popularityRange: [0, 10000],
    episodeRange: [1, 1000],
    startDate: '',
    endDate: '',
    studio: '',
    producer: '',
    orderBy: 'score',
    sort: 'desc'
  });

  // Load search history and popular searches
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }

    // Mock popular searches (in real app, this would come from analytics)
    setPopularSearches([
      'Attack on Titan', 'Demon Slayer', 'One Piece', 'Naruto', 'Dragon Ball',
      'Death Note', 'Fullmetal Alchemist', 'Spirited Away', 'Your Name', 'Studio Ghibli'
    ]);
  }, []);

  // Load genres and other filter data
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        const [genresRes, studiosRes, producersRes] = await Promise.all([
          fetch('https://api.jikan.moe/v4/genres/anime'),
          fetch('https://api.jikan.moe/v4/producers'),
          fetch('https://api.jikan.moe/v4/producers')
        ]);

        const [genresData, studiosData, producersData] = await Promise.all([
          genresRes.json(),
          studiosRes.json(),
          producersRes.json()
        ]);

        setAvailableGenres(genresData.data || []);
        setStudios(studiosData.data || []);
        setProducers(producersData.data || []);
      } catch (error) {
        console.error('Error loading filter data:', error);
      }
    };

    loadFilterData();
  }, []);

  // Handle URL parameters
  useEffect(() => {
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type')?.split(',') || [];
    const status = searchParams.get('status')?.split(',') || [];
    const rating = searchParams.get('rating')?.split(',') || [];
    const year = searchParams.get('year') || '';
    const genres = searchParams.get('genres')?.split(',') || [];
    const orderBy = searchParams.get('orderBy') || 'score';
    const sort = (searchParams.get('sort') as 'asc' | 'desc') || 'desc';

    setSearchQuery(query);
    setFilters(prev => ({
      ...prev,
      type,
      status,
      rating,
      year,
      genres,
      orderBy,
      sort
    }));

    if (query) {
      performSearch(query, { ...filters, type, status, rating, year, genres, orderBy, sort });
    }
  }, [searchParams]);

  const performSearch = useCallback(async (query: string, searchFilters: SearchFilters, page: number = 1) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append('q', query);
      params.append('page', page.toString());
      params.append('limit', '25');

      // Apply filters
      if (searchFilters.type.length > 0) {
        params.append('type', searchFilters.type.join(','));
      }
      if (searchFilters.status.length > 0) {
        params.append('status', searchFilters.status.join(','));
      }
      if (searchFilters.rating.length > 0) {
        params.append('rating', searchFilters.rating.join(','));
      }
      if (searchFilters.year) {
        params.append('start_date', `${searchFilters.year}-01-01`);
        params.append('end_date', `${searchFilters.year}-12-31`);
      }
      if (searchFilters.genres.length > 0) {
        params.append('genres', searchFilters.genres.join(','));
      }
      if (searchFilters.scoreRange[0] > 0) {
        params.append('min_score', searchFilters.scoreRange[0].toString());
      }
      if (searchFilters.scoreRange[1] < 10) {
        params.append('max_score', searchFilters.scoreRange[1].toString());
      }
      if (searchFilters.orderBy) {
        params.append('order_by', searchFilters.orderBy);
      }
      if (searchFilters.sort) {
        params.append('sort', searchFilters.sort);
      }

      const response = await fetch(`https://api.jikan.moe/v4/anime?${params.toString()}`);
      
      if (!response.ok) {
        if (response.status === 429) {
          // Wait 1 second and retry once
          await new Promise(resolve => setTimeout(resolve, 1000));
          const retryResponse = await fetch(`https://api.jikan.moe/v4/anime?${params.toString()}`);
          if (!retryResponse.ok) {
            throw new Error('Too many requests. Please wait a moment and try again.');
          }
          const retryData: SearchResult = await retryResponse.json();
          if (page === 1) {
            setSearchResults(retryData.data);
          } else {
            setSearchResults(prev => [...prev, ...retryData.data]);
          }
          setTotalPages(retryData.pagination.last_visible_page);
          setTotalResults(retryData.pagination.items.total);
          return;
        }
        throw new Error('Failed to fetch search results');
      }

      const data: SearchResult = await response.json();
      
      if (page === 1) {
        setSearchResults(data.data);
      } else {
        setSearchResults(prev => [...prev, ...data.data]);
      }
      
      setTotalPages(data.pagination.last_visible_page);
      setTotalResults(data.pagination.items.total);

      // Save to search history
      setSearchHistory(prev => {
        if (!prev.includes(query)) {
          const newHistory = [query, ...prev].slice(0, 10);
          localStorage.setItem('searchHistory', JSON.stringify(newHistory));
          return newHistory;
        }
        return prev;
      });

    } catch (error) {
      console.error('Search error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while searching');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    
    setSearchQuery(query);
    setCurrentPage(1);
    
    // Update URL
    const params = new URLSearchParams();
    params.append('q', query);
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        params.append(key, value.join(','));
      } else if (typeof value === 'string' && value) {
        params.append(key, value);
      }
    });
    
    router.push(`/search?${params.toString()}`);
  };

  const handleFilterChange = (filterType: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const applyFilters = () => {
    if (searchQuery) {
      performSearch(searchQuery, filters);
    }
  };

  const clearAllFilters = () => {
    setFilters({
      type: [],
      status: [],
      rating: [],
      year: '',
      genres: [],
      excludeGenres: [],
      scoreRange: [0, 10],
      popularityRange: [0, 10000],
      episodeRange: [1, 1000],
      startDate: '',
      endDate: '',
      studio: '',
      producer: '',
      orderBy: 'score',
      sort: 'desc'
    });
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
    router.push('/search');
  };

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsVoiceSearching(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        handleSearch(transcript);
      };
      recognition.onerror = () => setIsVoiceSearching(false);
      recognition.onend = () => setIsVoiceSearching(false);

      recognition.start();
    }
  };

  const loadMoreResults = () => {
    if (currentPage < totalPages && !loading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      performSearch(searchQuery, filters, nextPage);
    }
  };

  const removeFromHistory = (query: string) => {
    const newHistory = searchHistory.filter(item => item !== query);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center text-gray-400 text-sm gap-2 px-6 pt-6">
        <Link href="/dashboard" className="hover:text-white">Home</Link>
        <span className="mx-1">›</span>
        <span className="text-white">Search</span>
      </nav>
      {/* Search Header */}
      <section className="bg-gradient-to-r from-red-900/20 via-black to-green-900/20 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Find Your Next Anime</h1>
            <p className="text-xl text-gray-300">Search by title, genre, studio, or any keyword</p>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search for anime by title, genre, or studio..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  className="w-full px-6 py-4 pl-12 pr-20 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200 text-lg"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                {isVoiceSearching && (
                  <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="w-5 h-5 text-red-400 animate-spin" />
                  </div>
                )}
              </div>
              <button
                onClick={() => handleSearch(searchQuery)}
                disabled={loading || !searchQuery.trim()}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-medium transition-colors flex items-center space-x-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                <span>Search</span>
              </button>
              <button
                onClick={handleVoiceSearch}
                className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl transition-colors"
                title="Voice Search"
              >
                {isVoiceSearching ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Filters */}
        <section className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="text-sm font-medium text-gray-300">Quick Filters:</span>
            
            {/* Type Filter */}
            <div className="flex flex-wrap gap-2">
              {['All', 'TV', 'Movie', 'OVA', 'ONA', 'Special'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    if (type === 'All') {
                      handleFilterChange('type', []);
                    } else {
                      const newTypes = filters.type.includes(type)
                        ? filters.type.filter(t => t !== type)
                        : [...filters.type, type];
                      handleFilterChange('type', newTypes);
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    (type === 'All' && filters.type.length === 0) || filters.type.includes(type)
                      ? 'bg-red-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              {['All', 'Airing', 'Finished', 'Upcoming'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    if (status === 'All') {
                      handleFilterChange('status', []);
                    } else {
                      const newStatus = filters.status.includes(status)
                        ? filters.status.filter(s => s !== status)
                        : [...filters.status, status];
                      handleFilterChange('status', newStatus);
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    (status === 'All' && filters.status.length === 0) || filters.status.includes(status)
                      ? 'bg-red-600 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Year Filter */}
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
            >
              <option value="">All Years</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
              <option value="2019">2019</option>
              <option value="2018">2018</option>
              <option value="2017">2017</option>
              <option value="2016">2016</option>
              <option value="2015">2015</option>
            </select>

            <button
              onClick={clearAllFilters}
              className="text-green-400 hover:text-green-300 transition-colors text-sm font-medium flex items-center space-x-1"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Clear All</span>
            </button>

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="text-white hover:text-red-400 transition-colors text-sm font-medium flex items-center space-x-1"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Advanced Search</span>
              {showAdvancedFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Genres */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Genres</label>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {availableGenres.slice(0, 20).map((genre) => (
                      <label key={genre.mal_id} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={filters.genres.includes(genre.name)}
                          onChange={(e) => {
                            const newGenres = e.target.checked
                              ? [...filters.genres, genre.name]
                              : filters.genres.filter(g => g !== genre.name);
                            handleFilterChange('genres', newGenres);
                          }}
                          className="w-4 h-4 text-red-600 bg-white/10 border-white/20 rounded focus:ring-red-500"
                        />
                        <span className="text-gray-300">{genre.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Score Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Score Range: {filters.scoreRange[0]} - {filters.scoreRange[1]}
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={filters.scoreRange[0]}
                      onChange={(e) => handleFilterChange('scoreRange', [parseFloat(e.target.value), filters.scoreRange[1]])}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={filters.scoreRange[1]}
                      onChange={(e) => handleFilterChange('scoreRange', [filters.scoreRange[0], parseFloat(e.target.value)])}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Order By */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Sort By</label>
                  <div className="space-y-2">
                    <select
                      value={filters.orderBy}
                      onChange={(e) => handleFilterChange('orderBy', e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    >
                      <option value="score">Score</option>
                      <option value="popularity">Popularity</option>
                      <option value="title">Title</option>
                      <option value="start_date">Start Date</option>
                      <option value="end_date">End Date</option>
                      <option value="episodes">Episodes</option>
                    </select>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleFilterChange('sort', 'desc')}
                        className={`flex-1 py-1 px-3 rounded text-sm font-medium transition-colors ${
                          filters.sort === 'desc' ? 'bg-red-600 text-white' : 'bg-white/10 text-gray-300'
                        }`}
                      >
                        <ArrowDown className="w-4 h-4 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleFilterChange('sort', 'asc')}
                        className={`flex-1 py-1 px-3 rounded text-sm font-medium transition-colors ${
                          filters.sort === 'asc' ? 'bg-red-600 text-white' : 'bg-white/10 text-gray-300'
                        }`}
                      >
                        <ArrowUp className="w-4 h-4 mx-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={clearAllFilters}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={applyFilters}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Apply Filters</span>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Search Results or Browse Sections */}
        {searchQuery ? (
          <div className="space-y-6">
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Found {totalResults.toLocaleString()} results for "{searchQuery}"
                </h2>
                {loading && <p className="text-gray-400 mt-1">Searching...</p>}
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-red-600 text-white' : 'bg-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Search Error</h3>
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={() => performSearch(searchQuery, filters)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* No Results State */}
            {!loading && searchResults.length === 0 && !error && (
              <div className="text-center py-16">
                <SearchX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">No anime found</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  No results found for "{searchQuery}". Try different keywords or adjust your filters.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={clearSearch}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Clear Search
                  </button>
                  <Link
                    href="/discover"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Try AI Recommender
                  </Link>
                </div>
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {searchResults.map((anime) => (
                      <div key={anime.mal_id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 group hover:border-red-500/50 transition-all duration-300">
                        <div className="aspect-[3/4] mb-3 rounded-lg overflow-hidden bg-gray-800">
                          <img
                            src={anime.images.jpg.large_image_url}
                            alt={anime.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const next = e.currentTarget.nextElementSibling;
                              if (next && next instanceof HTMLElement) {
                                next.style.display = 'flex';
                              }
                            }}
                          />
                          <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                            <Play className="w-8 h-8 text-gray-400" />
                          </div>
                        </div>
                        <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                          {anime.title_english || anime.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <div className="flex items-center space-x-1">
                            {anime.score && (
                              <>
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-yellow-400">{anime.score}</span>
                              </>
                            )}
                          </div>
                          <span className="text-gray-400">{anime.type}</span>
                          <span className="text-gray-400">{anime.year}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {anime.genres.slice(0, 3).map((genre) => (
                            <span key={genre.mal_id} className="px-2 py-1 bg-white/10 text-xs rounded text-gray-300">
                              {genre.name}
                            </span>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <Link
                            href={`/anime/${anime.mal_id}`}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </Link>
                          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1">
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {searchResults.map((anime) => (
                      <div key={anime.mal_id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300">
                        <div className="flex items-start space-x-4">
                          <div className="w-20 h-28 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                            <img
                              src={anime.images.jpg.small_image_url}
                              alt={anime.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const next = e.currentTarget.nextElementSibling;
                                if (next && next instanceof HTMLElement) {
                                  next.style.display = 'flex';
                                }
                              }}
                            />
                            <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                              <Play className="w-6 h-6 text-gray-400" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-white mb-1">
                              {anime.title_english || anime.title}
                            </h3>
                            {anime.title_japanese && anime.title_japanese !== anime.title && (
                              <p className="text-gray-400 text-sm mb-2">{anime.title_japanese}</p>
                            )}
                            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                              {anime.synopsis?.substring(0, 150)}...
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                              {anime.score && (
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="text-yellow-400">{anime.score}</span>
                                </div>
                              )}
                              <span>{anime.type}</span>
                              <span>{anime.episodes} episodes</span>
                              <span>{anime.year}</span>
                              <span>{anime.status}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mb-4">
                              {anime.genres.map((genre) => (
                                <span key={genre.mal_id} className="px-2 py-1 bg-white/10 text-xs rounded text-gray-300">
                                  {genre.name}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Link
                              href={`/anime/${anime.mal_id}`}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View Details</span>
                            </Link>
                            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2">
                              <Plus className="w-4 h-4" />
                              <span>Add to List</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Load More Button */}
                {currentPage < totalPages && (
                  <div className="text-center mt-8">
                    <button
                      onClick={loadMoreResults}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                      <span>Load More Results</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          /* Browse Sections (shown when no search query) */
          <div className="space-y-12">
            {/* Search History */}
            {searchHistory.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Recent Searches</h2>
                  <button
                    onClick={clearHistory}
                    className="text-gray-400 hover:text-red-400 transition-colors text-sm"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((query, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2">
                      <button
                        onClick={() => handleSearch(query)}
                        className="text-white hover:text-red-400 transition-colors"
                      >
                        {query}
                      </button>
                      <button
                        onClick={() => removeFromHistory(query)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Popular Searches */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Trending Searches</h2>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(query)}
                    className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white hover:bg-white/10 hover:border-red-500/50 transition-all duration-300"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </section>

            {/* Browse by Category */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6">Browse by Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Top Genres */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Top Genres</h3>
                  <div className="space-y-2">
                    {['Action', 'Drama', 'Comedy', 'Romance', 'Adventure'].map((genre) => (
                      <button
                        key={genre}
                        onClick={() => handleSearch(genre)}
                        className="w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Studios */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Popular Studios</h3>
                  <div className="space-y-2">
                    {['Studio Ghibli', 'Ufotable', 'Wit Studio', 'Madhouse', 'Bones'].map((studio) => (
                      <button
                        key={studio}
                        onClick={() => handleSearch(studio)}
                        className="w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        {studio}
                      </button>
                    ))}
                  </div>
                </div>

                {/* By Year */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">By Year</h3>
                  <div className="space-y-2">
                    {['2024', '2023', '2022', '2021', '2020'].map((year) => (
                      <button
                        key={year}
                        onClick={() => {
                          handleFilterChange('year', year);
                          handleSearch('anime');
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}