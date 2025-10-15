'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AddAnimeModal from '@/components/AddAnimeModal';
import { 
  Star, 
  Edit3, 
  Trash2, 
  Eye, 
  Filter, 
  Search, 
  Calendar, 
  Plus, 
  Download, 
  Upload, 
  Grid3X3, 
  List, 
  LayoutGrid, 
  CheckSquare, 
  Square, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Clock, 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Heart, 
  Tag, 
  Settings, 
  MoreHorizontal, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  Loader2,
  FileText,
  Database,
  ExternalLink,
  BookOpen,
  Target,
  Award,
  Users,
  Zap
} from 'lucide-react';

// Types
interface AnimeEntry {
  animeId: number;
  title: string;
  titleEnglish?: string;
  titleJapanese?: string;
  image?: string;
  type?: string;
  episodes?: number;
  status: 'watching' | 'completed' | 'on-hold' | 'dropped' | 'plan-to-watch';
  episodesWatched: number;
  score?: number;
  startDate?: string;
  finishDate?: string;
  notes?: string;
  tags: string[];
  favorite: boolean;
  rewatchCount: number;
  priority?: 'low' | 'medium' | 'high';
  dateAdded: string;
  lastUpdated: string;
  genres?: string[];
  year?: number;
  rating?: string;
}

interface ListStats {
  totalAnime: number;
  episodesWatched: number;
  daysWatched: number;
  meanScore: number;
  standardDeviation: number;
  planToWatch: number;
  watching: number;
  completed: number;
  onHold: number;
  dropped: number;
  scoreDistribution: Record<number, number>;
  topGenres: Array<{ genre: string; count: number }>;
  activityData: Array<{ date: string; count: number }>;
}

interface CustomList {
  id: string;
  name: string;
  description?: string;
  animeIds: number[];
  createdAt: string;
  isPublic: boolean;
}

export default function MyListsPage() {
  const [animeEntries, setAnimeEntries] = useState<AnimeEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<AnimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'watching' | 'completed' | 'on-hold' | 'dropped' | 'plan-to-watch'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table' | 'compact'>('cards');
  const [sortBy, setSortBy] = useState<'title-asc' | 'title-desc' | 'score-high' | 'score-low' | 'date-added' | 'last-updated' | 'progress'>('title-asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntries, setSelectedEntries] = useState<number[]>([]);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showQuickEditModal, setShowQuickEditModal] = useState<AnimeEntry | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<ListStats | null>(null);
  const [customLists, setCustomLists] = useState<CustomList[]>([]);
  
  const router = useRouter();

  // Load anime entries and calculate stats
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedEntries = JSON.parse(localStorage.getItem('animeEntries') || '[]');
        const savedCustomLists = JSON.parse(localStorage.getItem('customLists') || '[]');
        
        setAnimeEntries(savedEntries);
        setCustomLists(savedCustomLists);
        
        // Calculate stats
        const calculatedStats = calculateStats(savedEntries);
        setStats(calculatedStats);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter and sort entries
  useEffect(() => {
    let filtered = animeEntries;

    // Filter by tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(entry => entry.status === activeTab);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(entry => 
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.titleEnglish?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort entries
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return (a.titleEnglish || a.title).localeCompare(b.titleEnglish || b.title);
        case 'title-desc':
          return (b.titleEnglish || b.title).localeCompare(a.titleEnglish || a.title);
        case 'score-high':
          return (b.score || 0) - (a.score || 0);
        case 'score-low':
          return (a.score || 0) - (b.score || 0);
        case 'date-added':
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        case 'last-updated':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'progress':
          const aProgress = a.episodes ? (a.episodesWatched / a.episodes) : 0;
          const bProgress = b.episodes ? (b.episodesWatched / b.episodes) : 0;
          return bProgress - aProgress;
        default:
          return 0;
      }
    });

    setFilteredEntries(filtered);
  }, [animeEntries, activeTab, sortBy, searchQuery]);

  const calculateStats = (entries: AnimeEntry[]): ListStats => {
    const totalAnime = entries.length;
    const episodesWatched = entries.reduce((sum, entry) => sum + entry.episodesWatched, 0);
    const daysWatched = Math.round(episodesWatched * 24 / 1440); // Assuming 24 min per episode
    
    const ratedEntries = entries.filter(e => e.score && e.score > 0);
    const meanScore = ratedEntries.length > 0 
      ? ratedEntries.reduce((sum, entry) => sum + (entry.score || 0), 0) / ratedEntries.length 
      : 0;
    
    const standardDeviation = ratedEntries.length > 0
      ? Math.sqrt(ratedEntries.reduce((sum, entry) => {
          const diff = (entry.score || 0) - meanScore;
          return sum + diff * diff;
        }, 0) / ratedEntries.length)
      : 0;
    
    const statusCounts = {
      'plan-to-watch': entries.filter(e => e.status === 'plan-to-watch').length,
      'watching': entries.filter(e => e.status === 'watching').length,
      'completed': entries.filter(e => e.status === 'completed').length,
      'on-hold': entries.filter(e => e.status === 'on-hold').length,
      'dropped': entries.filter(e => e.status === 'dropped').length
    };
    
    const scoreDistribution: Record<number, number> = {};
    for (let i = 1; i <= 10; i++) {
      scoreDistribution[i] = entries.filter(e => e.score === i).length;
    }
    
    const genreCounts: Record<string, number> = {};
    entries.forEach(entry => {
      entry.genres?.forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });
    
    const topGenres = Object.entries(genreCounts)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    return {
      totalAnime,
      episodesWatched,
      daysWatched,
      meanScore: Math.round(meanScore * 100) / 100,
      standardDeviation: Math.round(standardDeviation * 100) / 100,
      ...statusCounts,
      scoreDistribution,
      topGenres,
      activityData: [] // Mock data for now
    };
  };

  const handleSelectEntry = (animeId: number) => {
    setSelectedEntries(prev => 
      prev.includes(animeId) 
        ? prev.filter(id => id !== animeId)
        : [...prev, animeId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEntries.length === filteredEntries.length) {
      setSelectedEntries([]);
    } else {
      setSelectedEntries(filteredEntries.map(e => e.animeId));
    }
  };

  const handleUpdateEntry = (updatedEntry: AnimeEntry) => {
    const newEntries = animeEntries.map(entry => 
      entry.animeId === updatedEntry.animeId ? updatedEntry : entry
    );
    setAnimeEntries(newEntries);
    localStorage.setItem('animeEntries', JSON.stringify(newEntries));
    
    // Recalculate stats
    const newStats = calculateStats(newEntries);
    setStats(newStats);
  };

  const handleDeleteEntry = (animeId: number) => {
    const newEntries = animeEntries.filter(entry => entry.animeId !== animeId);
    setAnimeEntries(newEntries);
    localStorage.setItem('animeEntries', JSON.stringify(newEntries));
    setSelectedEntries(prev => prev.filter(id => id !== animeId));
    
    // Recalculate stats
    const newStats = calculateStats(newEntries);
    setStats(newStats);
  };

  const handleBulkDelete = () => {
    const newEntries = animeEntries.filter(entry => !selectedEntries.includes(entry.animeId));
    setAnimeEntries(newEntries);
    localStorage.setItem('animeEntries', JSON.stringify(newEntries));
    setSelectedEntries([]);
    setBulkEditMode(false);
    
    // Recalculate stats
    const newStats = calculateStats(newEntries);
    setStats(newStats);
  };

  const handleAddAnime = (animeData: any) => {
    const newEntries = [...animeEntries, animeData];
    setAnimeEntries(newEntries);
    localStorage.setItem('animeEntries', JSON.stringify(newEntries));
    
    // Recalculate stats
    const newStats = calculateStats(newEntries);
    setStats(newStats);
  };

  const handleIncrementEpisode = (animeId: number) => {
    const entry = animeEntries.find(e => e.animeId === animeId);
    if (!entry) return;
    
    const newEpisodesWatched = Math.min(entry.episodesWatched + 1, entry.episodes || entry.episodesWatched + 1);
    const updatedEntry = {
      ...entry,
      episodesWatched: newEpisodesWatched,
      lastUpdated: new Date().toISOString(),
      status: newEpisodesWatched >= (entry.episodes || 0) ? 'completed' as const : entry.status
    };
    
    handleUpdateEntry(updatedEntry);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'watching': return 'bg-green-500/20 text-green-400';
      case 'completed': return 'bg-red-500/20 text-red-400';
      case 'on-hold': return 'bg-yellow-500/20 text-yellow-400';
      case 'dropped': return 'bg-gray-500/20 text-gray-400';
      case 'plan-to-watch': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'watching': return <Play className="w-3 h-3" />;
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'on-hold': return <Pause className="w-3 h-3" />;
      case 'dropped': return <XCircle className="w-3 h-3" />;
      case 'plan-to-watch': return <Clock className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  const StarRating = ({ rating, size = 'sm' }: { rating?: number; size?: 'sm' | 'md' }) => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4'
    };

    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: 10 }, (_, i) => (
          <Star
            key={i}
            className={`${sizeClasses[size]} ${
              rating && i < rating ? 'text-red-500 fill-current' : 'text-gray-400'
            }`}
          />
        ))}
        {rating && <span className="text-sm text-gray-300 ml-1">{rating}/10</span>}
      </div>
    );
  };

  const getTabCount = (status: string) => {
    if (status === 'all') return animeEntries.length;
    return animeEntries.filter(entry => entry.status === status).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading your anime lists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center text-gray-400 text-sm gap-2 px-6 pt-6">
        <Link href="/dashboard" className="hover:text-white">Home</Link>
        <span className="mx-1">›</span>
        <span className="text-white">My Lists</span>
      </nav>
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900/20 via-black to-green-900/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Anime Lists</h1>
              <p className="text-gray-300">Organize and track your anime collection</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
                {stats?.totalAnime || 0} Anime
              </div>
              <button
                onClick={() => setShowImportModal(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Import</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Anime</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Status Tabs */}
        <div className="flex space-x-1 bg-white/5 rounded-lg p-1 mb-6">
          {[
            { key: 'all', label: 'All' },
            { key: 'watching', label: 'Watching' },
            { key: 'completed', label: 'Completed' },
            { key: 'on-hold', label: 'On Hold' },
            { key: 'dropped', label: 'Dropped' },
            { key: 'plan-to-watch', label: 'Plan to Watch' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {label} ({getTabCount(key)})
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your lists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 w-full sm:w-64"
                />
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
              >
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="score-high">Score (High to Low)</option>
                <option value="score-low">Score (Low to High)</option>
                <option value="date-added">Date Added</option>
                <option value="last-updated">Last Updated</option>
                <option value="progress">Progress</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>

            {/* View Mode and Actions */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'cards' ? 'bg-red-600 text-white' : 'bg-white/10 text-gray-400 hover:text-white'
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
                <button
                  onClick={() => setViewMode('compact')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'compact' ? 'bg-red-600 text-white' : 'bg-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setShowStats(!showStats)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Stats</span>
              </button>

              <button
                onClick={() => setBulkEditMode(!bulkEditMode)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  bulkEditMode ? 'bg-red-600 text-white' : 'bg-white/10 text-gray-400 hover:text-white'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span>Bulk Edit</span>
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {bulkEditMode && selectedEntries.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <p className="text-gray-300">
                  {selectedEntries.length} item{selectedEntries.length !== 1 ? 's' : ''} selected
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={handleBulkDelete}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Selected</span>
                  </button>
                  <button
                    onClick={() => setBulkEditMode(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Lists Content */}
          <div className="lg:col-span-3">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-16">
                <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  {activeTab === 'all' ? 'No Anime in Your Lists' : `No ${activeTab.replace('-', ' ')} Anime`}
                </h3>
                <p className="text-gray-400 mb-6">
                  {activeTab === 'all' 
                    ? 'Start building your anime collection by adding your first anime!'
                    : `You don't have any ${activeTab.replace('-', ' ')} anime yet.`
                  }
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Your First Anime</span>
                </button>
              </div>
            ) : (
              <>
                {/* Select All */}
                {bulkEditMode && (
                  <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg mb-4">
                    <button
                      onClick={handleSelectAll}
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                    >
                      {selectedEntries.length === filteredEntries.length ? (
                        <CheckSquare className="w-5 h-5 text-red-400" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                      <span>Select All</span>
                    </button>
                  </div>
                )}

                {/* Cards View */}
                {viewMode === 'cards' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredEntries.map((entry) => (
                      <div key={entry.animeId} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 group hover:border-red-500/50 transition-all duration-300">
                        {bulkEditMode && (
                          <button
                            onClick={() => handleSelectEntry(entry.animeId)}
                            className="absolute top-2 left-2 z-10"
                          >
                            {selectedEntries.includes(entry.animeId) ? (
                              <CheckSquare className="w-5 h-5 text-red-400" />
                            ) : (
                              <Square className="w-5 h-5 text-gray-400 hover:text-white" />
                            )}
                          </button>
                        )}
                        
                        <div className="aspect-[3/4] mb-3 rounded-lg overflow-hidden bg-gray-800">
                          <img
                            src={entry.image || '/images/placeholder-anime.jpg'}
                            alt={entry.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        
                        <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                          {entry.titleEnglish || entry.title}
                        </h3>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 rounded text-xs flex items-center space-x-1 ${getStatusColor(entry.status)}`}>
                              {getStatusIcon(entry.status)}
                              <span className="capitalize">{entry.status.replace('-', ' ')}</span>
                            </span>
                            {entry.favorite && <Heart className="w-4 h-4 text-red-400 fill-current" />}
                          </div>
                          
                          {entry.episodes && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-gray-400">
                                <span>Progress</span>
                                <span>{entry.episodesWatched}/{entry.episodes}</span>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-1">
                                <div 
                                  className="bg-red-500 h-1 rounded-full transition-all duration-300"
                                  style={{ width: `${(entry.episodesWatched / entry.episodes) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                          
                          <StarRating rating={entry.score} />
                        </div>
                        
                        <div className="flex space-x-2">
                          <Link
                            href={`/anime/${entry.animeId}`}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </Link>
                          <button
                            onClick={() => setShowQuickEditModal(entry)}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>
                          {entry.status === 'watching' && entry.episodes && entry.episodesWatched < entry.episodes && (
                            <button
                              onClick={() => handleIncrementEpisode(entry.animeId)}
                              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                              title="Mark next episode watched"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Table View */}
                {viewMode === 'table' && (
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-white/5">
                          <tr>
                            {bulkEditMode && (
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                <button
                                  onClick={handleSelectAll}
                                  className="flex items-center space-x-2"
                                >
                                  {selectedEntries.length === filteredEntries.length ? (
                                    <CheckSquare className="w-4 h-4 text-red-400" />
                                  ) : (
                                    <Square className="w-4 h-4 text-gray-400" />
                                  )}
                                </button>
                              </th>
                            )}
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Anime</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Progress</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Score</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date Added</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {filteredEntries.map((entry) => (
                            <tr key={entry.animeId} className="hover:bg-white/5 transition-colors">
                              {bulkEditMode && (
                                <td className="px-4 py-3">
                                  <button
                                    onClick={() => handleSelectEntry(entry.animeId)}
                                    className="flex items-center space-x-2"
                                  >
                                    {selectedEntries.includes(entry.animeId) ? (
                                      <CheckSquare className="w-4 h-4 text-red-400" />
                                    ) : (
                                      <Square className="w-4 h-4 text-gray-400" />
                                    )}
                                  </button>
                                </td>
                              )}
                              <td className="px-4 py-3">
                                <div className="flex items-center space-x-3">
                                  <div className="w-12 h-16 rounded overflow-hidden bg-gray-800 flex-shrink-0">
                                    <img
                                      src={entry.image || '/images/placeholder-anime.jpg'}
                                      alt={entry.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <div className="font-medium text-white">{entry.titleEnglish || entry.title}</div>
                                    {entry.titleJapanese && entry.titleJapanese !== entry.title && (
                                      <div className="text-sm text-gray-400">{entry.titleJapanese}</div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-300">{entry.type}</td>
                              <td className="px-4 py-3">
                                <div className="space-y-1">
                                  <div className="text-sm text-gray-300">
                                    {entry.episodesWatched}/{entry.episodes || '?'}
                                  </div>
                                  {entry.episodes && (
                                    <div className="w-20 bg-gray-700 rounded-full h-1">
                                      <div 
                                        className="bg-red-500 h-1 rounded-full"
                                        style={{ width: `${(entry.episodesWatched / entry.episodes) * 100}%` }}
                                      ></div>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <StarRating rating={entry.score} />
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded text-xs flex items-center space-x-1 w-fit ${getStatusColor(entry.status)}`}>
                                  {getStatusIcon(entry.status)}
                                  <span className="capitalize">{entry.status.replace('-', ' ')}</span>
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-300">
                                {new Date(entry.dateAdded).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center space-x-2">
                                  <Link
                                    href={`/anime/${entry.animeId}`}
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Link>
                                  <button
                                    onClick={() => setShowQuickEditModal(entry)}
                                    className="text-green-400 hover:text-green-300 transition-colors"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteEntry(entry.animeId)}
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Compact View */}
                {viewMode === 'compact' && (
                  <div className="space-y-2">
                    {filteredEntries.map((entry) => (
                      <div key={entry.animeId} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 hover:border-red-500/50 transition-all duration-300">
                        <div className="flex items-center space-x-4">
                          {bulkEditMode && (
                            <button
                              onClick={() => handleSelectEntry(entry.animeId)}
                              className="flex-shrink-0"
                            >
                              {selectedEntries.includes(entry.animeId) ? (
                                <CheckSquare className="w-4 h-4 text-red-400" />
                              ) : (
                                <Square className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                          )}
                          
                          <div className="w-8 h-10 rounded overflow-hidden bg-gray-800 flex-shrink-0">
                            <img
                              src={entry.image || '/images/placeholder-anime.jpg'}
                              alt={entry.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-white truncate">{entry.titleEnglish || entry.title}</div>
                            <div className="text-sm text-gray-400">
                              {entry.episodesWatched}/{entry.episodes || '?'} • {entry.score ? `${entry.score}/10` : 'Not rated'}
                            </div>
                          </div>
                          
                          <span className={`px-2 py-1 rounded text-xs flex items-center space-x-1 ${getStatusColor(entry.status)}`}>
                            {getStatusIcon(entry.status)}
                            <span className="capitalize">{entry.status.replace('-', ' ')}</span>
                          </span>
                          
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/anime/${entry.animeId}`}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => setShowQuickEditModal(entry)}
                              className="text-green-400 hover:text-green-300 transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistics Panel */}
            {showStats && stats && (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-2xl font-bold text-white">{stats.totalAnime}</p>
                      <p className="text-gray-400 text-sm">Total Anime</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{stats.episodesWatched}</p>
                      <p className="text-gray-400 text-sm">Episodes</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{stats.daysWatched}</p>
                      <p className="text-gray-400 text-sm">Days Watched</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{stats.meanScore}</p>
                      <p className="text-gray-400 text-sm">Mean Score</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Watching</span>
                      <span className="text-green-400">{stats.watching}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Completed</span>
                      <span className="text-red-400">{stats.completed}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">On Hold</span>
                      <span className="text-yellow-400">{stats.onHold}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Dropped</span>
                      <span className="text-gray-400">{stats.dropped}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Plan to Watch</span>
                      <span className="text-blue-400">{stats.planToWatch}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Anime</span>
                </button>
                <button
                  onClick={() => setShowImportModal(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Import List</span>
                </button>
                <button
                  onClick={() => {
                    const dataStr = JSON.stringify(animeEntries, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'my-anime-list.json';
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Lists</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Edit Modal */}
      {showQuickEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/20 rounded-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-4">Edit Anime Entry</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={showQuickEditModal.status}
                  onChange={(e) => setShowQuickEditModal({
                    ...showQuickEditModal,
                    status: e.target.value as any
                  })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                >
                  <option value="watching">Watching</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                  <option value="dropped">Dropped</option>
                  <option value="plan-to-watch">Plan to Watch</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Episodes Watched</label>
                <input
                  type="number"
                  min="0"
                  max={showQuickEditModal.episodes || 1000}
                  value={showQuickEditModal.episodesWatched}
                  onChange={(e) => setShowQuickEditModal({
                    ...showQuickEditModal,
                    episodesWatched: parseInt(e.target.value) || 0
                  })}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Rating</label>
                <StarRating 
                  rating={showQuickEditModal.score} 
                  size="md"
                />
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={showQuickEditModal.score || 0}
                  onChange={(e) => setShowQuickEditModal({
                    ...showQuickEditModal,
                    score: parseInt(e.target.value)
                  })}
                  className="w-full mt-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                <textarea
                  value={showQuickEditModal.notes || ''}
                  onChange={(e) => setShowQuickEditModal({
                    ...showQuickEditModal,
                    notes: e.target.value
                  })}
                  rows={3}
                  maxLength={500}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none"
                  placeholder="Add private notes..."
                />
                <p className="text-gray-400 text-xs mt-1">
                  {(showQuickEditModal.notes || '').length}/500 characters
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="favorite"
                  checked={showQuickEditModal.favorite}
                  onChange={(e) => setShowQuickEditModal({
                    ...showQuickEditModal,
                    favorite: e.target.checked
                  })}
                  className="w-4 h-4 text-red-600 bg-white/10 border-white/20 rounded focus:ring-red-500"
                />
                <label htmlFor="favorite" className="text-white text-sm cursor-pointer">
                  Mark as favorite
                </label>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowQuickEditModal(null)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleUpdateEntry({
                    ...showQuickEditModal,
                    lastUpdated: new Date().toISOString()
                  });
                  setShowQuickEditModal(null);
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Anime Modal */}
      <AddAnimeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddAnime={handleAddAnime}
      />
    </div>
  );
}
