'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  Play, 
  Plus, 
  Star, 
  BookOpen, 
  BarChart3, 
  Loader2,
  Sparkles,
  Award,
  AlertCircle,
  Zap,
  Cloud
} from 'lucide-react';

// Types
interface Anime {
  mal_id: number;
  title: string;
  title_english?: string;
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
}

interface Mood {
  id: string;
  name: string;
  icon: any;
  genres: string[];
  description: string;
  color: string;
}

interface FilterOptions {
  genres: string[];
  type: string[];
  status: string[];
  rating: string[];
  scoreRange: [number, number];
  yearRange: [number, number];
  episodeRange: [number, number];
  excludeGenres: string[];
}

interface RecommendationSet {
  id: string;
  date: string;
  moods: string[];
  filters: FilterOptions;
  recommendations: Anime[];
  name?: string;
}

export default function DiscoverPage() {
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    genres: [],
    type: [],
    status: [],
    rating: [],
    scoreRange: [1, 10],
    yearRange: [1960, 2025],
    episodeRange: [1, 1000],
    excludeGenres: []
  });
  const [preferences, setPreferences] = useState({
    showReviewed: false,
    showInLists: false,
    prioritizeRated: true,
    includeLessPopular: false
  });
  const [recommendations, setRecommendations] = useState<Anime[]>([]);
  const [topPick, setTopPick] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendationHistory, setRecommendationHistory] = useState<RecommendationSet[]>([]);
  const [availableGenres, setAvailableGenres] = useState<Array<{ mal_id: number; name: string }>>([]);
  const router = useRouter();

  // Mock authentication check
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/signin');
    }
  }, [router]);

  // Load recommendation history and genres
  useEffect(() => {
    const loadData = async () => {
      // Load recommendation history from localStorage
      const savedHistory = localStorage.getItem('recommendationHistory');
      if (savedHistory) {
        setRecommendationHistory(JSON.parse(savedHistory));
      }

      // Load available genres
      try {
        const response = await fetch('https://api.jikan.moe/v4/genres/anime');
        const data = await response.json();
        setAvailableGenres(data.data || []);
      } catch (error) {
        console.error('Error loading genres:', error);
      }
    };

    loadData();
  }, []);

  // Handle mood pre-selection from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const moodParam = urlParams.get('mood');
    if (moodParam && moods.some(mood => mood.id === moodParam)) {
      setSelectedMoods([moodParam]);
    }
  }, []);

  const moods: Mood[] = [
    {
      id: 'excited',
      name: 'Excited',
      icon: Zap,
      genres: ['Action', 'Shounen', 'Sports', 'Mecha'],
      description: 'High-energy anime with intense action and battles',
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 'relaxed',
      name: 'Relaxed',
      icon: Cloud,
      genres: ['Slice of Life', 'Iyashikei', 'Comedy', 'Drama'],
      description: 'Calm and healing anime to unwind with',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'curious',
      name: 'Curious',
      icon: Brain,
      genres: ['Mystery', 'Psychological', 'Thriller', 'Supernatural'],
      description: 'Mind-bending stories that make you think',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'nostalgic',
      name: 'Nostalgic',
      icon: Clock,
      genres: ['Classic', 'Retro', 'Old School'],
      description: 'Timeless classics and retro anime',
      color: 'from-yellow-500 to-amber-500'
    },
    {
      id: 'romantic',
      name: 'Romantic',
      icon: Heart,
      genres: ['Romance', 'Shoujo', 'Drama', 'Josei'],
      description: 'Heartwarming love stories and relationships',
      color: 'from-pink-500 to-rose-500'
    },
    {
      id: 'adventurous',
      name: 'Adventurous',
      icon: Compass,
      genres: ['Adventure', 'Fantasy', 'Isekai', 'Action'],
      description: 'Epic journeys and fantastical worlds',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const handleMoodSelect = (moodId: string) => {
    setSelectedMoods(prev => 
      prev.includes(moodId) 
        ? prev.filter(id => id !== moodId)
        : [...prev, moodId]
    );
  };

  const handleFilterChange = (filterType: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const generateRecommendations = async () => {
    if (selectedMoods.length === 0) {
      setError('Please select at least one mood to get recommendations');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get genres from selected moods
      const selectedMoodGenres = selectedMoods.flatMap(moodId => 
        moods.find(mood => mood.id === moodId)?.genres || []
      );

      // Build API query parameters
      const queryParams = new URLSearchParams();
      
      // Add genre filters
      if (filters.genres.length > 0) {
        queryParams.append('genres', filters.genres.join(','));
      } else if (selectedMoodGenres.length > 0) {
        queryParams.append('genres', selectedMoodGenres.join(','));
      }

      // Add other filters
      if (filters.type.length > 0) {
        queryParams.append('type', filters.type.join(','));
      }
      if (filters.status.length > 0) {
        queryParams.append('status', filters.status.join(','));
      }
      if (filters.scoreRange[0] > 1) {
        queryParams.append('min_score', filters.scoreRange[0].toString());
      }
      if (filters.scoreRange[1] < 10) {
        queryParams.append('max_score', filters.scoreRange[1].toString());
      }

      // Fetch anime from Jikan API
      const response = await fetch(`https://api.jikan.moe/v4/anime?${queryParams.toString()}&limit=20&order_by=popularity`);
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        const animeList = data.data;
        
        // Filter out anime user has already reviewed or added to lists (if preferences are set)
        let filteredAnime = animeList;
        
        if (!preferences.showReviewed) {
          // In a real app, you'd check against user's review history
          // For now, we'll just use the full list
        }
        
        if (!preferences.showInLists) {
          // In a real app, you'd check against user's anime lists
          // For now, we'll just use the full list
        }

        // Calculate match percentages and sort
        const scoredAnime = filteredAnime.map(anime => ({
          ...anime,
          matchPercentage: calculateMatchPercentage(anime, selectedMoods, filters)
        }));

        // Sort by match percentage and score
        scoredAnime.sort((a, b) => {
          if (a.matchPercentage !== b.matchPercentage) {
            return b.matchPercentage - a.matchPercentage;
          }
          return (b.score || 0) - (a.score || 0);
        });

        setRecommendations(scoredAnime.slice(1)); // Skip first for top pick
        setTopPick(scoredAnime[0]);

        // Save to recommendation history
        const newRecommendationSet: RecommendationSet = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          moods: selectedMoods,
          filters,
          recommendations: scoredAnime
        };

        const updatedHistory = [newRecommendationSet, ...recommendationHistory];
        setRecommendationHistory(updatedHistory);
        localStorage.setItem('recommendationHistory', JSON.stringify(updatedHistory));

      } else {
        setError('No anime found matching your criteria. Try adjusting your filters.');
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setError('Unable to fetch recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateMatchPercentage = (anime: Anime, selectedMoods: string[], filters: FilterOptions): number => {
    let score = 0;
    let totalCriteria = 0;

    // Check mood-based genre matches
    const selectedMoodGenres = selectedMoods.flatMap(moodId => 
      moods.find(mood => mood.id === moodId)?.genres || []
    );
    
    if (selectedMoodGenres.length > 0) {
      totalCriteria += 1;
      const genreMatches = anime.genres.filter(genre => 
        selectedMoodGenres.some(moodGenre => 
          genre.name.toLowerCase().includes(moodGenre.toLowerCase()) ||
          moodGenre.toLowerCase().includes(genre.name.toLowerCase())
        )
      ).length;
      score += (genreMatches / selectedMoodGenres.length) * 100;
    }

    // Check score range
    if (anime.score && filters.scoreRange[0] <= anime.score && anime.score <= filters.scoreRange[1]) {
      score += 20;
    }
    totalCriteria += 1;

    // Check year range
    if (anime.year && filters.yearRange[0] <= anime.year && anime.year <= filters.yearRange[1]) {
      score += 20;
    }
    totalCriteria += 1;

    // Check type filter
    if (filters.type.length === 0 || (anime.type && filters.type.includes(anime.type))) {
      score += 20;
    }
    totalCriteria += 1;

    // Check status filter
    if (filters.status.length === 0 || filters.status.includes(anime.status)) {
      score += 20;
    }
    totalCriteria += 1;

    return totalCriteria > 0 ? Math.round(score / totalCriteria) : 0;
  };

  const generateRecommendationExplanation = (anime: Anime, selectedMoods: string[]): string => {
    const moodNames = selectedMoods.map(moodId => 
      moods.find(mood => mood.id === moodId)?.name
    ).join(' and ');

    const genreNames = anime.genres.slice(0, 3).map(g => g.name).join(', ');
    
    return `Perfect for when you're feeling ${moodNames.toLowerCase()}. This ${anime.type?.toLowerCase() || 'anime'} combines ${genreNames} to create an engaging experience that matches your current mood.`;
  };

  const resetFilters = () => {
    setFilters({
      genres: [],
      type: [],
      status: [],
      rating: [],
      scoreRange: [1, 10],
      yearRange: [1960, 2025],
      episodeRange: [1, 1000],
      excludeGenres: []
    });
    setSelectedMoods([]);
  };

  const saveRecommendationSet = () => {
    const setName = prompt('Name your recommendation set:');
    if (setName && recommendationHistory.length > 0) {
      const updatedHistory = [...recommendationHistory];
      updatedHistory[0].name = setName;
      setRecommendationHistory(updatedHistory);
      localStorage.setItem('recommendationHistory', JSON.stringify(updatedHistory));
      alert('Recommendation set saved!');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-red-900/20 via-black to-green-900/20 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
              <Sparkles className="w-12 h-12 text-red-400" />
              <span>Discover Your Next Anime</span>
            </h1>
            <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
              Tell us how you're feeling, and we'll recommend the perfect anime for you to review and add to your lists.
            </p>
            <div className="flex items-center justify-center space-x-6 text-gray-400">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Based on your 47 reviews</span>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>247 anime in your lists</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Mood Selector */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">How are you feeling?</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {moods.map((mood) => {
                  const IconComponent = mood.icon;
                  const isSelected = selectedMoods.includes(mood.id);
                  return (
                    <button
                      key={mood.id}
                      onClick={() => handleMoodSelect(mood.id)}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 text-left group ${
                        isSelected
                          ? 'border-red-500 bg-red-500/10'
                          : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${mood.color} flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{mood.name}</h3>
                          <p className="text-sm text-gray-400">{mood.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {mood.genres.slice(0, 3).map((genre) => (
                          <span
                            key={genre}
                            className="px-2 py-1 bg-white/10 text-xs rounded text-gray-300"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Advanced Filters */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center space-x-2 text-white hover:text-red-400 transition-colors mb-6"
              >
                <Filter className="w-5 h-5" />
                <span className="font-semibold">Advanced Filters</span>
                {showAdvancedFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showAdvancedFilters && (
                <div className="space-y-6">
                  {/* Genre Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Genres</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
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

                  {/* Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">Type</label>
                    <div className="flex flex-wrap gap-2">
                      {['TV', 'Movie', 'OVA', 'Special', 'ONA'].map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            const newTypes = filters.type.includes(type)
                              ? filters.type.filter(t => t !== type)
                              : [...filters.type, type];
                            handleFilterChange('type', newTypes);
                          }}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            filters.type.includes(type)
                              ? 'bg-red-600 text-white'
                              : 'bg-white/10 text-gray-300 hover:bg-white/20'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Score Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Score Range: {filters.scoreRange[0]} - {filters.scoreRange[1]}
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.1"
                        value={filters.scoreRange[0]}
                        onChange={(e) => handleFilterChange('scoreRange', [parseFloat(e.target.value), filters.scoreRange[1]])}
                        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.1"
                        value={filters.scoreRange[1]}
                        onChange={(e) => handleFilterChange('scoreRange', [filters.scoreRange[0], parseFloat(e.target.value)])}
                        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={resetFilters}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset Filters</span>
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Preference Toggles */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
              <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'showReviewed', label: 'Show anime I\'ve already reviewed' },
                  { key: 'showInLists', label: 'Show anime in my lists' },
                  { key: 'prioritizeRated', label: 'Prioritize highly rated anime' },
                  { key: 'includeLessPopular', label: 'Include less popular anime' }
                ].map((pref) => (
                  <label key={pref.key} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={preferences[pref.key as keyof typeof preferences] as boolean}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        [pref.key]: e.target.checked
                      }))}
                      className="w-4 h-4 text-red-600 bg-white/10 border-white/20 rounded focus:ring-red-500"
                    />
                    <span className="text-gray-300">{pref.label}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Generate Button */}
            <div className="text-center">
              <button
                onClick={generateRecommendations}
                disabled={loading || selectedMoods.length === 0}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-12 py-4 rounded-xl font-semibold text-lg transition-colors flex items-center space-x-3 mx-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Generating recommendations...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    <span>Get Recommendations</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400">{error}</span>
              </div>
            )}

            {/* Top Pick */}
            {topPick && (
              <section className="bg-gradient-to-r from-red-500/10 to-green-500/10 backdrop-blur-sm border border-red-500/20 rounded-xl p-8">
                <div className="flex items-center space-x-2 mb-6">
                  <Award className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Our Top Pick for You</h2>
                </div>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-48 flex-shrink-0">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-800">
                      <img
                        src={topPick.images.jpg.large_image_url}
                        alt={topPick.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                        <Play className="w-12 h-12 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {topPick.title_english || topPick.title}
                    </h3>
                    <div className="flex items-center space-x-4 mb-4">
                      {topPick.score && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="text-yellow-400 font-semibold">{topPick.score}</span>
                        </div>
                      )}
                      <span className="text-gray-400">{topPick.type}</span>
                      <span className="text-gray-400">{topPick.episodes} episodes</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {topPick.genres.slice(0, 4).map((genre) => (
                        <span key={genre.mal_id} className="px-3 py-1 bg-red-600 text-white text-sm rounded-full">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {generateRecommendationExplanation(topPick, selectedMoods)}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2">
                        <Plus className="w-4 h-4" />
                        <span>Add to List</span>
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2">
                        <BookOpen className="w-4 h-4" />
                        <span>Write Review</span>
                      </button>
                      <Link
                        href={`/anime/${topPick.mal_id}`}
                        className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* More Recommendations */}
            {recommendations.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">More Recommendations</h2>
                  <button
                    onClick={saveRecommendationSet}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save This Set</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((anime) => (
                    <div key={anime.mal_id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 group hover:border-red-500/50 transition-all duration-300">
                      <div className="aspect-[3/4] mb-4 rounded-lg overflow-hidden bg-gray-800">
                        <img
                          src={anime.images.jpg.large_image_url}
                          alt={anime.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                          <Play className="w-8 h-8 text-gray-400" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                        {anime.title_english || anime.title}
                      </h3>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-1">
                          {anime.score && (
                            <>
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-yellow-400 text-sm">{anime.score}</span>
                            </>
                          )}
                        </div>
                        <span className="text-green-400 text-sm font-medium">
                          {(anime as any).matchPercentage}% match
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {anime.genres.slice(0, 3).map((genre) => (
                          <span key={genre.mal_id} className="px-2 py-1 bg-white/10 text-xs rounded text-gray-300">
                            {genre.name}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {anime.synopsis?.substring(0, 100)}...
                      </p>
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1">
                          <Plus className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                        <Link
                          href={`/anime/${anime.mal_id}`}
                          className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
                    Load More Recommendations
                  </button>
                </div>
              </section>
            )}
          </div>

          {/* Recommendation History Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Previous Recommendations</h3>
                <button
                  onClick={() => {
                    setRecommendationHistory([]);
                    localStorage.removeItem('recommendationHistory');
                  }}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {recommendationHistory.slice(0, 5).map((set) => (
                  <div key={set.id} className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">
                        {new Date(set.date).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-green-400">
                        {set.recommendations.length} anime
                      </span>
                    </div>
                    <div className="text-sm text-white mb-1">
                      {set.name || 'Unnamed Set'}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {set.moods.slice(0, 2).map((moodId) => {
                        const mood = moods.find(m => m.id === moodId);
                        return mood ? (
                          <span key={moodId} className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded">
                            {mood.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                ))}
                {recommendationHistory.length === 0 && (
                  <p className="text-gray-400 text-sm text-center py-4">
                    No previous recommendations yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
