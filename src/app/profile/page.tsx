'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  MapPin, 
  Twitter, 
  MessageCircle, 
  Edit3, 
  UserPlus, 
  Star, 
  Play, 
  Clock, 
  BarChart3,
  Heart,
  Settings,
  Filter,
  Grid3X3,
  List,
  ChevronDown,
  MoreHorizontal,
  Trash2,
  Download,
  Eye,
  EyeOff,
  Share2,
  ThumbsUp,
  MessageSquare,
  TrendingUp,
  Award,
  Users,
  Film,
  Music,
  BookOpen,
  Calendar as CalendarIcon,
  Target,
  Zap,
  Activity
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

// Types
interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  coverImage?: string;
  bio: string;
  location?: string;
  memberSince: string;
  socialLinks: {
    twitter?: string;
    discord?: string;
    website?: string;
  };
  stats: {
    totalAnime: number;
    episodesWatched: number;
    daysWatched: number;
    meanScore: number;
  };
}

interface AnimeEntry {
  mal_id: number;
  title: string;
  title_english?: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
    };
  };
  userRating: number;
  userStatus: 'watching' | 'completed' | 'on_hold' | 'dropped' | 'plan_to_watch';
  episodesWatched: number;
  totalEpisodes: number;
  userNotes?: string;
  lastUpdated: string;
  score: number;
  genres: Array<{ name: string }>;
  studios: Array<{ name: string }>;
  year: number;
}

interface Review {
  id: string;
  animeId: number;
  animeTitle: string;
  animeImage: string;
  rating: number;
  reviewText: string;
  datePosted: string;
  helpfulCount: number;
  isPublic: boolean;
}

interface Activity {
  id: string;
  type: 'watched' | 'added' | 'reviewed' | 'rated' | 'completed';
  animeId: number;
  animeTitle: string;
  animeImage: string;
  timestamp: string;
  details: string;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [listFilter, setListFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isOwnProfile, setIsOwnProfile] = useState(true);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [animeList, setAnimeList] = useState<AnimeEntry[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [favorites, setFavorites] = useState<{
    anime: AnimeEntry[];
    characters: Array<{ id: number; name: string; image: string; anime: string }>;
    voiceActors: Array<{ id: number; name: string; image: string; anime: string }>;
    studios: Array<{ id: number; name: string; animeCount: number }>;
  }>({
    anime: [],
    characters: [],
    voiceActors: [],
    studios: []
  });
  const router = useRouter();

  // Mock authentication check
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/signin');
    }
  }, [router]);

  // Mock data loading
  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      
      // Mock user profile data
      const mockUser: UserProfile = {
        id: '1',
        username: 'animefan92',
        displayName: 'Anime Fan',
        avatar: '/api/placeholder/150/150',
        coverImage: '/api/placeholder/1200/300',
        bio: 'Passionate anime enthusiast who loves discovering new series and sharing reviews with the community.',
        location: 'Tokyo, Japan',
        memberSince: '2020-03-15',
        socialLinks: {
          twitter: '@animefan92',
          discord: 'animefan92#1234',
          website: 'https://animefan92.com'
        },
        stats: {
          totalAnime: 247,
          episodesWatched: 3847,
          daysWatched: 64.1,
          meanScore: 7.8
        }
      };

      // Mock anime list data
      const mockAnimeList: AnimeEntry[] = [
        {
          mal_id: 1,
          title: 'Attack on Titan',
          title_english: 'Attack on Titan',
          images: { jpg: { image_url: '/api/placeholder/300/400', small_image_url: '/api/placeholder/150/200' } },
          userRating: 9,
          userStatus: 'completed',
          episodesWatched: 75,
          totalEpisodes: 75,
          userNotes: 'Masterpiece! The story and animation are incredible.',
          lastUpdated: '2024-01-15',
          score: 9.0,
          genres: [{ name: 'Action' }, { name: 'Drama' }],
          studios: [{ name: 'Wit Studio' }],
          year: 2013
        },
        {
          mal_id: 2,
          title: 'Demon Slayer',
          title_english: 'Demon Slayer: Kimetsu no Yaiba',
          images: { jpg: { image_url: '/api/placeholder/300/400', small_image_url: '/api/placeholder/150/200' } },
          userRating: 8,
          userStatus: 'watching',
          episodesWatched: 12,
          totalEpisodes: 26,
          lastUpdated: '2024-01-20',
          score: 8.5,
          genres: [{ name: 'Action' }, { name: 'Supernatural' }],
          studios: [{ name: 'Ufotable' }],
          year: 2019
        }
      ];

      // Mock reviews data
      const mockReviews: Review[] = [
        {
          id: '1',
          animeId: 1,
          animeTitle: 'Attack on Titan',
          animeImage: '/api/placeholder/150/200',
          rating: 9,
          reviewText: 'This anime completely changed my perspective on storytelling. The character development is phenomenal and the plot twists are mind-blowing.',
          datePosted: '2024-01-15',
          helpfulCount: 247,
          isPublic: true
        }
      ];

      // Mock activities data
      const mockActivities: Activity[] = [
        {
          id: '1',
          type: 'watched',
          animeId: 2,
          animeTitle: 'Demon Slayer',
          animeImage: '/api/placeholder/150/200',
          timestamp: '2024-01-20T10:30:00Z',
          details: 'Watched episode 12'
        },
        {
          id: '2',
          type: 'reviewed',
          animeId: 1,
          animeTitle: 'Attack on Titan',
          animeImage: '/api/placeholder/150/200',
          timestamp: '2024-01-15T14:20:00Z',
          details: 'Wrote a review'
        }
      ];

      setUser(mockUser);
      setAnimeList(mockAnimeList);
      setReviews(mockReviews);
      setActivities(mockActivities);
      setLoading(false);
    };

    loadProfileData();
  }, []);

  const handleEditProfile = () => {
    alert('Edit profile functionality coming soon!');
  };

  const handleFollow = () => {
    alert('Follow functionality coming soon!');
  };

  const handleUpdateAnimeEntry = (animeId: number, updates: Partial<AnimeEntry>) => {
    setAnimeList(prev => prev.map(anime => 
      anime.mal_id === animeId ? { ...anime, ...updates } : anime
    ));
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId));
  };

  const filteredAnimeList = listFilter === 'all' 
    ? animeList 
    : animeList.filter(anime => anime.userStatus === listFilter);

  const statusColors = {
    watching: 'bg-blue-500',
    completed: 'bg-green-500',
    on_hold: 'bg-yellow-500',
    dropped: 'bg-red-500',
    plan_to_watch: 'bg-gray-500'
  };

  const statusLabels = {
    watching: 'Watching',
    completed: 'Completed',
    on_hold: 'On Hold',
    dropped: 'Dropped',
    plan_to_watch: 'Plan to Watch'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Profile Not Found</h1>
          <p className="text-gray-400 mb-6">This user profile could not be found.</p>
          <Link href="/dashboard" className="text-red-400 hover:text-red-300 transition-colors">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Profile Header */}
      <section className="relative">
        {/* Cover Banner */}
        <div 
          className="h-64 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
          style={{
            backgroundImage: user.coverImage ? `url(${user.coverImage})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Profile Info */}
        <div className="relative -mt-16 px-6 pb-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-black bg-gray-800 flex items-center justify-center overflow-hidden">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              </div>
              
              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{user.displayName}</h1>
                    <p className="text-xl text-gray-300 mb-2">@{user.username}</p>
                    <div className="flex items-center space-x-4 text-gray-400 mb-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Member since {new Date(user.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                      </div>
                      {user.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{user.location}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-300 mb-4 max-w-2xl">{user.bio}</p>
                    
                    {/* Social Links */}
                    <div className="flex items-center space-x-4">
                      {user.socialLinks.twitter && (
                        <a href={`https://twitter.com/${user.socialLinks.twitter.replace('@', '')}`} className="text-gray-400 hover:text-blue-400 transition-colors">
                          <Twitter className="w-5 h-5" />
                        </a>
                      )}
                      {user.socialLinks.discord && (
                        <span className="text-gray-400">{user.socialLinks.discord}</span>
                      )}
                      {user.socialLinks.website && (
                        <a href={user.socialLinks.website} className="text-gray-400 hover:text-green-400 transition-colors">
                          <BookOpen className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4 mt-4 md:mt-0">
                    {isOwnProfile ? (
                      <button
                        onClick={handleEditProfile}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleFollow}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>Follow</span>
                        </button>
                        <button className="p-3 bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 rounded-lg transition-colors">
                          <MessageCircle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{user.stats.totalAnime}</div>
                    <div className="text-sm text-gray-400">Anime Watched</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{user.stats.episodesWatched.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Episodes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{user.stats.daysWatched}</div>
                    <div className="text-sm text-gray-400">Days Watched</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{user.stats.meanScore}</div>
                    <div className="text-sm text-gray-400">Mean Score</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <nav className="flex space-x-8">
            {['overview', 'anime-lists', 'reviews', 'stats', 'favorites'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 text-sm font-medium transition-colors capitalize ${
                  activeTab === tab
                    ? 'text-red-400 border-b-2 border-red-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* Tab Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Recent Activity Feed */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <img
                        src={activity.animeImage}
                        alt={activity.animeTitle}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <Film className="w-6 h-6 text-gray-400" style={{ display: 'none' }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">{activity.animeTitle}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400 text-sm">{activity.details}</span>
                      </div>
                      <p className="text-gray-400 text-sm">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                Load More
              </button>
            </section>

            {/* Currently Watching */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Currently Watching</h3>
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {animeList.filter(anime => anime.userStatus === 'watching').map((anime) => (
                  <div key={anime.mal_id} className="flex-shrink-0 w-48 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                    <div className="aspect-[3/4] mb-3 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
                      <img
                        src={anime.images.jpg.small_image_url}
                        alt={anime.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <Film className="w-8 h-8 text-gray-400" style={{ display: 'none' }} />
                    </div>
                    <h4 className="font-semibold text-white mb-2 line-clamp-2">{anime.title_english || anime.title}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Progress</span>
                        <span>{anime.episodesWatched}/{anime.totalEpisodes}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(anime.episodesWatched / anime.totalEpisodes) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Favorite Anime */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Favorite Anime</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {animeList.filter(anime => anime.userRating >= 9).slice(0, 5).map((anime) => (
                  <Link key={anime.mal_id} href={`/anime/${anime.mal_id}`} className="group">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={anime.images.jpg.small_image_url}
                        alt={anime.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <Film className="w-8 h-8 text-gray-400" style={{ display: 'none' }} />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Quick Stats Widget */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Quick Stats</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4">Anime by Status</h4>
                  <div className="space-y-2">
                    {Object.entries(statusLabels).map(([status, label]) => {
                      const count = animeList.filter(anime => anime.userStatus === status).length;
                      const percentage = animeList.length > 0 ? (count / animeList.length) * 100 : 0;
                      return (
                        <div key={status} className="flex items-center justify-between">
                          <span className="text-gray-300">{label}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${statusColors[status as keyof typeof statusColors]}`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-white text-sm w-8 text-right">{count}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-white mb-4">Mean Score</h4>
                  <div className="text-4xl font-bold text-green-400 mb-2">{user.stats.meanScore}</div>
                  <p className="text-gray-400">Based on {animeList.filter(anime => anime.userRating > 0).length} rated anime</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'anime-lists' && (
          <div className="space-y-6">
            {/* Filter and View Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                {['all', 'watching', 'completed', 'on_hold', 'dropped', 'plan_to_watch'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setListFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      listFilter === filter
                        ? 'bg-red-600 text-white'
                        : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
                    }`}
                  >
                    {filter === 'all' ? 'All' : statusLabels[filter as keyof typeof statusLabels]}
                  </button>
                ))}
              </div>
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
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'table' ? 'bg-red-600 text-white' : 'bg-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Anime List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredAnimeList.map((anime) => (
                  <div key={anime.mal_id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 group">
                    <div className="aspect-[3/4] mb-3 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center">
                      <img
                        src={anime.images.jpg.small_image_url}
                        alt={anime.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <Film className="w-8 h-8 text-gray-400" style={{ display: 'none' }} />
                    </div>
                    <h4 className="font-semibold text-white mb-2 line-clamp-2">{anime.title_english || anime.title}</h4>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className={`px-2 py-1 rounded text-xs ${statusColors[anime.userStatus]}`}>
                        {statusLabels[anime.userStatus]}
                      </span>
                      {anime.userRating > 0 && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-yellow-400">{anime.userRating}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {anime.episodesWatched}/{anime.totalEpisodes} episodes
                    </div>
                    <button className="w-full mt-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/10">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Anime</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Rating</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Progress</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Last Updated</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredAnimeList.map((anime) => (
                        <tr key={anime.mal_id} className="hover:bg-white/5">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-16 rounded overflow-hidden bg-gray-800 flex items-center justify-center flex-shrink-0">
                                <img
                                  src={anime.images.jpg.small_image_url}
                                  alt={anime.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling.style.display = 'flex';
                                  }}
                                />
                                <Film className="w-4 h-4 text-gray-400" style={{ display: 'none' }} />
                              </div>
                              <div>
                                <div className="font-medium text-white">{anime.title_english || anime.title}</div>
                                <div className="text-sm text-gray-400">{anime.title}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs ${statusColors[anime.userStatus]}`}>
                              {statusLabels[anime.userStatus]}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {anime.userRating > 0 ? (
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-yellow-400">{anime.userRating}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-300">
                              {anime.episodesWatched}/{anime.totalEpisodes}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-400">
                              {new Date(anime.lastUpdated).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">My Reviews</h3>
              <div className="flex items-center space-x-2">
                <select className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
                  <option>All Ratings</option>
                  <option>5 Stars</option>
                  <option>4 Stars</option>
                  <option>3 Stars</option>
                  <option>2 Stars</option>
                  <option>1 Star</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <img
                        src={review.animeImage}
                        alt={review.animeTitle}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <Film className="w-6 h-6 text-gray-400" style={{ display: 'none' }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">{review.animeTitle}</h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                              />
                            ))}
                          </div>
                          <span className="text-gray-400 text-sm">{review.datePosted}</span>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-4 leading-relaxed">{review.reviewText}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                            <span className="text-sm">{review.helpfulCount}</span>
                          </button>
                          <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors">
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-sm">Reply</span>
                          </button>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteReview(review.id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white">Statistics</h3>
            
            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">{user.stats.totalAnime}</div>
                <div className="text-gray-400">Total Anime</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">{user.stats.episodesWatched.toLocaleString()}</div>
                <div className="text-gray-400">Episodes Watched</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">{user.stats.daysWatched}</div>
                <div className="text-gray-400">Days Watched</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">{user.stats.meanScore}</div>
                <div className="text-gray-400">Mean Score</div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Score Distribution */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h4 className="text-xl font-semibold text-white mb-4">Score Distribution</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { score: '1', count: 2 },
                      { score: '2', count: 1 },
                      { score: '3', count: 3 },
                      { score: '4', count: 5 },
                      { score: '5', count: 8 },
                      { score: '6', count: 12 },
                      { score: '7', count: 25 },
                      { score: '8', count: 45 },
                      { score: '9', count: 38 },
                      { score: '10', count: 15 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="score" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} />
                      <Bar dataKey="count" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Genres Chart */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h4 className="text-xl font-semibold text-white mb-4">Top Genres</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Action', value: 45 },
                          { name: 'Drama', value: 32 },
                          { name: 'Comedy', value: 28 },
                          { name: 'Romance', value: 22 },
                          { name: 'Adventure', value: 18 }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {[
                          { name: 'Action', value: 45, color: '#EF4444' },
                          { name: 'Drama', value: 32, color: '#10B981' },
                          { name: 'Comedy', value: 28, color: '#F59E0B' },
                          { name: 'Romance', value: 22, color: '#8B5CF6' },
                          { name: 'Adventure', value: 18, color: '#06B6D4' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-white">Favorites</h3>
            
            {/* Favorite Anime */}
            <section className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-semibold text-white">Favorite Anime</h4>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2">
                  <Edit3 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {animeList.filter(anime => anime.userRating >= 9).map((anime) => (
                  <Link key={anime.mal_id} href={`/anime/${anime.mal_id}`} className="group">
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={anime.images.jpg.small_image_url}
                        alt={anime.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                      <Film className="w-8 h-8 text-gray-400" style={{ display: 'none' }} />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Other favorite sections would go here */}
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">More favorite sections coming soon!</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
