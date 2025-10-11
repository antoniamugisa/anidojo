'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronDown, 
  Heart, 
  Share2, 
  Star, 
  Play, 
  Calendar, 
  Clock, 
  User, 
  Film,
  MessageCircle,
  ThumbsUp,
  MessageSquare,
  MoreHorizontal,
  Edit3,
  Trash2,
  Download,
  Eye,
  EyeOff,
  Settings,
  Home,
  ArrowLeft
} from 'lucide-react';

// Types for Jikan API responses
interface AnimeDetails {
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
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  trailer?: {
    youtube_id?: string;
    url?: string;
    embed_url?: string;
  };
  synopsis?: string;
  score?: number;
  scored_by?: number;
  rank?: number;
  popularity?: number;
  members?: number;
  favorites?: number;
  status: string;
  type?: string;
  episodes?: number;
  duration?: string;
  rating?: string;
  aired: {
    from: string;
    to?: string;
    prop: {
      from: { day: number; month: number; year: number };
      to: { day: number; month: number; year: number };
    };
  };
  premiered?: {
    season: string;
    year: number;
  };
  broadcast?: {
    day?: string;
    time?: string;
    timezone?: string;
    string?: string;
  };
  producers: Array<{
    mal_id: number;
    type: string;
    name: string;
  }>;
  licensors: Array<{
    mal_id: number;
    type: string;
    name: string;
  }>;
  studios: Array<{
    mal_id: number;
    type: string;
    name: string;
  }>;
  genres: Array<{
    mal_id: number;
    type: string;
    name: string;
  }>;
  themes: Array<{
    mal_id: number;
    type: string;
    name: string;
  }>;
  demographics: Array<{
    mal_id: number;
    type: string;
    name: string;
  }>;
  relations?: Array<{
    relation: string;
    entry: Array<{
      mal_id: number;
      type: string;
      name: string;
      url: string;
    }>;
  }>;
  characters?: Array<{
    character: {
      mal_id: number;
      url: string;
      images: {
        jpg: {
          image_url: string;
          small_image_url: string;
        };
        webp: {
          image_url: string;
          small_image_url: string;
        };
      };
      name: string;
    };
    role: string;
    voice_actors: Array<{
      person: {
        mal_id: number;
        url: string;
        images: {
          jpg: {
            image_url: string;
          };
        };
        name: string;
      };
      language: string;
    }>;
  }>;
  staff?: Array<{
    person: {
      mal_id: number;
      url: string;
      images: {
        jpg: {
          image_url: string;
        };
      };
      name: string;
    };
    positions: string[];
  }>;
  statistics?: {
    watching: number;
    completed: number;
    on_hold: number;
    dropped: number;
    plan_to_watch: number;
    total: number;
    scores: {
      1: { votes: number; percentage: number };
      2: { votes: number; percentage: number };
      3: { votes: number; percentage: number };
      4: { votes: number; percentage: number };
      5: { votes: number; percentage: number };
      6: { votes: number; percentage: number };
      7: { votes: number; percentage: number };
      8: { votes: number; percentage: number };
      9: { votes: number; percentage: number };
      10: { votes: number; percentage: number };
    };
  };
}

interface Episode {
  mal_id: number;
  url: string;
  title: string;
  title_japanese?: string;
  title_romanji?: string;
  aired: string;
  filler: boolean;
  recap: boolean;
  forum_url: string;
}

export default function AnimeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: animeId } = use(params);
  const [anime, setAnime] = useState<AnimeDetails | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isFavorite, setIsFavorite] = useState(false);
  const [userList, setUserList] = useState<string>('');
  const [expandedSynopsis, setExpandedSynopsis] = useState(false);
  const [watchedEpisodes, setWatchedEpisodes] = useState<Set<number>>(new Set());
  const router = useRouter();

  // Mock authentication check
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/signin');
    }
  }, [router]);

  // Fetch anime details
  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch anime details
        const animeResponse = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/full`);
        if (!animeResponse.ok) {
          throw new Error('Anime not found');
        }
        const animeData = await animeResponse.json();
        setAnime(animeData.data);

        // Fetch episodes
        const episodesResponse = await fetch(`https://api.jikan.moe/v4/anime/${animeId}/episodes`);
        if (episodesResponse.ok) {
          const episodesData = await episodesResponse.json();
          setEpisodes(episodesData.data || []);
        }

      } catch (err) {
        console.error('Error fetching anime details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load anime details');
      } finally {
        setLoading(false);
      }
    };

    if (animeId) {
      fetchAnimeDetails();
    }
  }, [animeId]);

  const handleAddToList = (listType: string) => {
    setUserList(listType);
    // Here you would typically save to user's actual list
    alert(`Added to ${listType}`);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Here you would typically save to user's favorites
  };

  const handleMarkEpisodeWatched = (episodeId: number) => {
    setWatchedEpisodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(episodeId)) {
        newSet.delete(episodeId);
      } else {
        newSet.add(episodeId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'currently airing':
        return 'text-green-400 bg-green-500/20';
      case 'finished airing':
        return 'text-gray-400 bg-gray-500/20';
      case 'not yet aired':
        return 'text-blue-400 bg-blue-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading anime details...</p>
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Anime Not Found</h1>
          <p className="text-gray-400 mb-6">{error || 'This anime could not be found.'}</p>
          <Link href="/dashboard" className="text-red-400 hover:text-red-300 transition-colors">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Breadcrumb Navigation */}
      <nav className="bg-black/95 backdrop-blur-sm border-b border-white/10 px-6 py-4">
        <div className="flex items-center space-x-2 text-sm">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
            Home
          </Link>
          <span className="text-gray-600">›</span>
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
            Anime
          </Link>
          <span className="text-gray-600">›</span>
          <span className="text-white truncate max-w-md">{anime.title_english || anime.title}</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        {/* Background Banner */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${anime.images.jpg.large_image_url})`,
            filter: 'blur(2px) brightness(0.3)'
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        
        {/* Content */}
        <div className="relative z-10 h-full flex items-center px-6 py-12">
          <div className="flex items-start space-x-12 max-w-7xl mx-auto w-full">
            {/* Anime Poster */}
            <div className="flex-shrink-0">
              <img
                src={anime.images.jpg.large_image_url}
                alt={anime.title}
                className="w-72 h-96 object-cover rounded-lg shadow-2xl"
              />
            </div>
            
            {/* Anime Info */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-5xl font-bold text-white mb-3">
                  {anime.title_english || anime.title}
                </h1>
                {anime.title_japanese && anime.title_japanese !== anime.title && (
                  <h2 className="text-3xl text-gray-300 mb-6">
                    {anime.title_japanese}
                  </h2>
                )}
              </div>
              
              {/* Rating and Reviews */}
              <div className="flex items-center space-x-6">
                {anime.score && (
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl font-bold text-white">
                      {anime.score}
                    </div>
                    <div className="text-gray-400">
                      <div className="text-lg">/ 10</div>
                      <div className="text-sm">{anime.scored_by?.toLocaleString()} reviews</div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Genres */}
              <div className="flex flex-wrap gap-3">
                {anime.genres.slice(0, 5).map((genre) => (
                  <span
                    key={genre.mal_id}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-full font-medium"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
              
              {/* Status and Info */}
              <div className="flex items-center space-x-8 text-base">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(anime.status)}`}>
                  {anime.status}
                </span>
                {anime.episodes && (
                  <span className="text-gray-300">
                    {anime.episodes} episodes
                  </span>
                )}
                {anime.duration && (
                  <span className="text-gray-300">
                    {anime.duration}
                  </span>
                )}
                {anime.aired.from && (
                  <span className="text-gray-300">
                    {new Date(anime.aired.from).getFullYear()}
                  </span>
                )}
              </div>
              
              {/* Studio */}
              {anime.studios.length > 0 && (
                <div className="text-gray-300 text-lg">
                  <span className="text-gray-500">Studio: </span>
                  {anime.studios.map(studio => studio.name).join(', ')}
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-6 pt-6">
                <div className="relative">
                  <select
                    value={userList}
                    onChange={(e) => handleAddToList(e.target.value)}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-medium transition-colors appearance-none pr-10 text-base"
                  >
                    <option value="">Add to List</option>
                    <option value="Currently Watching">Currently Watching</option>
                    <option value="Plan to Watch">Plan to Watch</option>
                    <option value="Completed">Completed</option>
                    <option value="Dropped">Dropped</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <Link
                  href={`/anime/${anime.mal_id}/review`}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-medium transition-colors text-base inline-flex items-center justify-center"
                >
                  Write Review
                </Link>
                
                <button
                  onClick={handleToggleFavorite}
                  className={`p-4 rounded-lg transition-colors ${
                    isFavorite 
                      ? 'bg-red-600 text-white' 
                      : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                
                <button className="p-4 bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 rounded-lg transition-colors">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {['overview', 'episodes', 'reviews', 'characters', 'staff', 'stats'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 text-sm font-medium transition-colors capitalize ${
                  activeTab === tab
                    ? 'text-red-400 border-b-2 border-red-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* Synopsis */}
            {anime.synopsis && (
              <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Synopsis</h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {expandedSynopsis || anime.synopsis.length < 500
                    ? anime.synopsis
                    : anime.synopsis.substring(0, 500) + '...'
                  }
                </p>
                {anime.synopsis.length > 500 && (
                  <button
                    onClick={() => setExpandedSynopsis(!expandedSynopsis)}
                    className="text-red-400 hover:text-red-300 mt-2 font-medium"
                  >
                    {expandedSynopsis ? 'Read Less' : 'Read More'}
                  </button>
                )}
              </section>
            )}

            {/* Information Grid */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-8">Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400 text-lg">Type:</span>
                    <span className="text-white text-lg font-medium">{anime.type || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400 text-lg">Episodes:</span>
                    <span className="text-white text-lg font-medium">{anime.episodes || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400 text-lg">Status:</span>
                    <span className="text-white text-lg font-medium">{anime.status}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400 text-lg">Aired:</span>
                    <span className="text-white text-lg font-medium">
                      {formatDate(anime.aired.from)} - {formatDate(anime.aired.to || '')}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400 text-lg">Premiered:</span>
                    <span className="text-white text-lg font-medium">
                      {anime.premiered ? `${anime.premiered.season} ${anime.premiered.year}` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400 text-lg">Duration:</span>
                    <span className="text-white text-lg font-medium">{anime.duration || 'N/A'}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400 text-lg">Rating:</span>
                    <span className="text-white text-lg font-medium">{anime.rating || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400 text-lg">Studios:</span>
                    <span className="text-white text-lg font-medium">
                      {anime.studios.map(s => s.name).join(', ') || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400 text-lg">Producers:</span>
                    <span className="text-white text-lg font-medium">
                      {anime.producers.map(p => p.name).join(', ') || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400 text-lg">Genres:</span>
                    <span className="text-white text-lg font-medium">
                      {anime.genres.map(g => g.name).join(', ') || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400 text-lg">Themes:</span>
                    <span className="text-white text-lg font-medium">
                      {anime.themes.map(t => t.name).join(', ') || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Trailer */}
            {anime.trailer?.youtube_id && (
              <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Trailer</h3>
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${anime.trailer.youtube_id}`}
                    title={`${anime.title} Trailer`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </section>
            )}

            {/* Related Anime */}
            {anime.relations && anime.relations.length > 0 && (
              <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Related Anime</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {anime.relations.slice(0, 8).map((relation, index) => (
                    <div key={index} className="text-center">
                      <div className="aspect-[3/4] bg-gray-800 rounded-lg mb-2 flex items-center justify-center">
                        <Film className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-300 mb-1">{relation.relation}</p>
                      <p className="text-xs text-gray-400 line-clamp-2">
                        {relation.entry[0]?.name || 'Unknown'}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {activeTab === 'episodes' && (
          <div className="space-y-8">
            {/* Progress Tracker */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Episode Progress</h3>
                <span className="text-gray-400">
                  {watchedEpisodes.size} / {episodes.length} watched
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${episodes.length > 0 ? (watchedEpisodes.size / episodes.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Episodes List */}
            <div className="space-y-3">
              {episodes.length > 0 ? episodes.map((episode, index) => (
                <div
                  key={episode.mal_id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:border-red-500/50 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={watchedEpisodes.has(episode.mal_id)}
                      onChange={() => handleMarkEpisodeWatched(episode.mal_id)}
                      className="w-5 h-5 text-green-600 bg-white/10 border-white/20 rounded focus:ring-green-500 focus:ring-2"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-400 w-16">
                          Ep {index + 1}
                        </span>
                        <div className="flex-1">
                          <h4 className="text-white font-medium line-clamp-1">
                            {episode.title || `Episode ${index + 1}`}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {formatDate(episode.aired)}
                          </p>
                        </div>
                        <div className="text-sm text-gray-400">
                          {episode.filler && (
                            <span className="px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded text-xs mr-2">
                              Filler
                            </span>
                          )}
                          {episode.recap && (
                            <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs mr-2">
                              Recap
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No episodes available</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">Reviews</h3>
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Write a Review
              </button>
            </div>

            {/* Mock Reviews */}
            <div className="space-y-6">
              {[
                {
                  user: 'AnimeFan92',
                  avatar: 'A',
                  rating: 5,
                  date: '2 days ago',
                  review: 'This anime completely changed my perspective on storytelling. The character development is phenomenal and the plot twists are mind-blowing. A masterpiece that will be remembered for generations.',
                  helpful: 247,
                  notHelpful: 12
                },
                {
                  user: 'MangaReader',
                  avatar: 'M',
                  rating: 4,
                  date: '1 week ago',
                  review: 'The animation quality is absolutely stunning! While the story follows some typical shonen tropes, the execution is flawless. Tanjiro\'s journey is both heartbreaking and inspiring.',
                  helpful: 189,
                  notHelpful: 8
                }
              ].map((review, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-400 font-bold text-lg">{review.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-white">{review.user}</h4>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400 text-sm">{review.date}</span>
                      </div>
                      <div className="flex items-center space-x-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-gray-300 mb-4 leading-relaxed">{review.review}</p>
                      <div className="flex items-center space-x-6">
                        <button className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                          <span className="text-sm">{review.helpful} helpful</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          <span className="text-sm">{review.notHelpful} not helpful</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'characters' && (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white">Characters</h3>
            {anime.characters && anime.characters.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {anime.characters.slice(0, 12).map((character, index) => (
                  <div key={character.character.mal_id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                    <div className="aspect-[3/4] mb-3 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
                      <img
                        src={character.character.images.jpg.image_url}
                        alt={character.character.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full flex items-center justify-center text-4xl" style={{ display: 'none' }}>
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                    </div>
                    <h4 className="font-semibold text-white mb-1 line-clamp-2">
                      {character.character.name}
                    </h4>
                    <p className="text-sm text-gray-400 mb-2">{character.role}</p>
                    {character.voice_actors.length > 0 && (
                      <p className="text-xs text-gray-500">
                        {character.voice_actors[0].person.name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No character data available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white">Staff</h3>
            {anime.staff && anime.staff.length > 0 ? (
              <div className="space-y-6">
                {anime.staff.slice(0, 20).map((member, index) => (
                  <div key={member.person.mal_id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center flex-shrink-0">
                        <img
                          src={member.person.images.jpg.image_url}
                          alt={member.person.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full flex items-center justify-center text-2xl" style={{ display: 'none' }}>
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{member.person.name}</h4>
                        <p className="text-sm text-gray-400">
                          {member.positions.join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No staff data available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white">Statistics</h3>
            
            {/* Score Distribution */}
            {anime.statistics?.scores && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
                <h4 className="text-xl font-semibold text-white mb-6">Score Distribution</h4>
                <div className="space-y-2">
                  {Object.entries(anime.statistics.scores).map(([score, data]) => (
                    <div key={score} className="flex items-center space-x-4">
                      <span className="w-8 text-sm text-gray-400">{score}</span>
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${data.percentage}%` }}
                        />
                      </div>
                      <span className="w-16 text-sm text-gray-400 text-right">
                        {data.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* List Statistics */}
            {anime.statistics && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
                <h4 className="text-xl font-semibold text-white mb-6">List Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">
                      {anime.statistics.watching.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">Watching</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {anime.statistics.completed.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      {anime.statistics.on_hold.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">On Hold</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">
                      {anime.statistics.dropped.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">Dropped</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-400">
                      {anime.statistics.plan_to_watch.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400">Plan to Watch</div>
                  </div>
                </div>
              </div>
            )}

            {/* General Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {anime.members?.toLocaleString() || 'N/A'}
                </div>
                <div className="text-gray-400">Members</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {anime.favorites?.toLocaleString() || 'N/A'}
                </div>
                <div className="text-gray-400">Favorites</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  #{anime.rank || 'N/A'}
                </div>
                <div className="text-gray-400">Ranked</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
