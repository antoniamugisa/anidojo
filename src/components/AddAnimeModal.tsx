'use client';

import { useState, useEffect } from 'react';
import { X, Search, Plus, Loader2, Play, CheckCircle, Pause, XCircle, Clock } from 'lucide-react';
import Image from 'next/image';

interface Anime {
  mal_id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  images: {
    jpg: {
      large_image_url: string;
    };
  };
  type?: string;
  episodes?: number;
  status: string;
  year?: number;
  genres: Array<{
    mal_id: number;
    name: string;
  }>;
}

interface AddAnimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAnime: (animeData: {
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
  }) => void;
}

export default function AddAnimeModal({ isOpen, onClose, onAddAnime }: AddAnimeModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [formData, setFormData] = useState({
    status: 'plan-to-watch' as 'watching' | 'completed' | 'on-hold' | 'dropped' | 'plan-to-watch',
    episodesWatched: 0,
    score: 0,
    notes: '',
    favorite: false,
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  // Search anime when query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const searchAnime = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchQuery)}&limit=10`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data.data || []);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchAnime, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSelectAnime = (anime: Anime) => {
    setSelectedAnime(anime);
    setFormData(prev => ({
      ...prev,
      episodesWatched: 0,
      score: 0
    }));
  };

  const handleAddAnime = () => {
    if (!selectedAnime) return;

    const animeData = {
      animeId: selectedAnime.mal_id,
      title: selectedAnime.title,
      titleEnglish: selectedAnime.title_english,
      titleJapanese: selectedAnime.title_japanese,
      image: selectedAnime.images.jpg.large_image_url,
      type: selectedAnime.type,
      episodes: selectedAnime.episodes,
      status: formData.status,
      episodesWatched: formData.episodesWatched,
      score: formData.score || undefined,
      notes: formData.notes,
      tags: [],
      favorite: formData.favorite,
      rewatchCount: 0,
      priority: formData.priority,
      dateAdded: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      genres: selectedAnime.genres.map(g => g.name),
      year: selectedAnime.year,
      rating: undefined
    };

    onAddAnime(animeData);
    onClose();
    
    // Reset form
    setSearchQuery('');
    setSearchResults([]);
    setSelectedAnime(null);
    setFormData({
      status: 'plan-to-watch',
      episodesWatched: 0,
      score: 0,
      notes: '',
      favorite: false,
      priority: 'medium'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'watching': return <Play className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'on-hold': return <Pause className="w-4 h-4" />;
      case 'dropped': return <XCircle className="w-4 h-4" />;
      case 'plan-to-watch': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-white/20 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Add Anime to Your List</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!selectedAnime ? (
          /* Search Step */
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50"
              />
              {loading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="w-4 h-4 text-red-400 animate-spin" />
                </div>
              )}
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {searchResults.map((anime) => (
                  <button
                    key={anime.mal_id}
                    onClick={() => handleSelectAnime(anime)}
                    className="w-full flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
                  >
                    <div className="w-12 h-16 rounded overflow-hidden bg-gray-800 flex-shrink-0">
                      <Image
                        src={anime.images.jpg.large_image_url}
                        alt={anime.title}
                        width={48}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white truncate">
                        {anime.title_english || anime.title}
                      </div>
                      {anime.title_japanese && anime.title_japanese !== anime.title && (
                        <div className="text-sm text-gray-400 truncate">{anime.title_japanese}</div>
                      )}
                      <div className="text-sm text-gray-400">
                        {anime.type} • {anime.year} • {anime.episodes ? `${anime.episodes} episodes` : 'Unknown episodes'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {searchQuery && !loading && searchResults.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">No anime found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        ) : (
          /* Form Step */
          <div className="space-y-6">
            {/* Selected Anime Info */}
            <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
              <div className="w-16 h-20 rounded overflow-hidden bg-gray-800 flex-shrink-0">
                <Image
                  src={selectedAnime.images.jpg.large_image_url}
                  alt={selectedAnime.title}
                  width={64}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white">{selectedAnime.title_english || selectedAnime.title}</h4>
                {selectedAnime.title_japanese && selectedAnime.title_japanese !== selectedAnime.title && (
                  <p className="text-sm text-gray-400">{selectedAnime.title_japanese}</p>
                )}
                <p className="text-sm text-gray-400">
                  {selectedAnime.type} • {selectedAnime.year} • {selectedAnime.episodes ? `${selectedAnime.episodes} episodes` : 'Unknown episodes'}
                </p>
              </div>
              <button
                onClick={() => setSelectedAnime(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                >
                  <option value="plan-to-watch">Plan to Watch</option>
                  <option value="watching">Watching</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                  <option value="dropped">Dropped</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Episodes Watched</label>
                <input
                  type="number"
                  min="0"
                  max={selectedAnime.episodes || 1000}
                  value={formData.episodesWatched}
                  onChange={(e) => setFormData(prev => ({ ...prev, episodesWatched: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Rating (Optional)</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={formData.score}
                  onChange={(e) => setFormData(prev => ({ ...prev, score: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0</span>
                  <span className="font-medium">{formData.score}/10</span>
                  <span>10</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Priority (for Plan to Watch)</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                maxLength={500}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none"
                placeholder="Add any notes about this anime..."
              />
              <p className="text-gray-400 text-xs mt-1">{formData.notes.length}/500 characters</p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="favorite"
                checked={formData.favorite}
                onChange={(e) => setFormData(prev => ({ ...prev, favorite: e.target.checked }))}
                className="w-4 h-4 text-red-600 bg-white/10 border-white/20 rounded focus:ring-red-500"
              />
              <label htmlFor="favorite" className="text-white text-sm cursor-pointer">
                Mark as favorite
              </label>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          {selectedAnime && (
            <button
              onClick={handleAddAnime}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add to List</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
