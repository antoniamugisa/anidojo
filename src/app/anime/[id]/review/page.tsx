'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Star, 
  Save, 
  Eye, 
  X, 
  AlertTriangle, 
  Clock, 
  Loader2,
  Send,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

// Types
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
  episodes?: number;
  status: string;
  type?: string;
  year?: number;
  genres: Array<{
    mal_id: number;
    name: string;
  }>;
}

interface Review {
  id: string;
  animeId: number;
  userId: string;
  rating: number;
  storyRating?: number;
  animationRating?: number;
  soundRating?: number;
  characterRating?: number;
  enjoymentRating?: number;
  title: string;
  body: string;
  spoilers: boolean;
  watchStatus: 'completed' | 'watching' | 'dropped' | 'plan-to-watch';
  episodesWatched?: number;
  tags: string[];
  pros?: string;
  cons?: string;
  recommendation?: 'highly-recommend' | 'recommend' | 'mixed' | 'not-recommend' | 'strongly-not-recommend';
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  helpfulVotes: number;
}

interface ReviewFormData {
  rating: number;
  storyRating: number;
  animationRating: number;
  soundRating: number;
  characterRating: number;
  enjoymentRating: number;
  title: string;
  body: string;
  spoilers: boolean;
  watchStatus: 'completed' | 'watching' | 'dropped' | 'plan-to-watch';
  episodesWatched: number;
  tags: string[];
  pros: string;
  cons: string;
  recommendation: 'highly-recommend' | 'recommend' | 'mixed' | 'not-recommend' | 'strongly-not-recommend';
}

export default function WriteReviewPage() {
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  
  const router = useRouter();
  const params = useParams();
  const animeId = params.id as string;
  const autoSaveRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const hasUnsavedChanges = useRef(false);

  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    storyRating: 0,
    animationRating: 0,
    soundRating: 0,
    characterRating: 0,
    enjoymentRating: 0,
    title: '',
    body: '',
    spoilers: false,
    watchStatus: 'completed',
    episodesWatched: 0,
    tags: [],
    pros: '',
    cons: '',
    recommendation: 'recommend'
  });

  const [newTag, setNewTag] = useState('');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [agreedToGuidelines, setAgreedToGuidelines] = useState(false);

  // Popular tags for autocomplete
  const popularTags = [
    'must-watch', 'overrated', 'hidden-gem', 'masterpiece', 'disappointing',
    'emotional', 'funny', 'dark', 'wholesome', 'action-packed', 'slow-burn',
    'character-driven', 'plot-driven', 'visually-stunning', 'underrated'
  ];

  // Load anime data and check for existing review
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load anime data
        const animeResponse = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
        if (animeResponse.ok) {
          const animeData = await animeResponse.json();
          setAnime(animeData.data);
        }

        // Check for existing review
        const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        const existingReview = reviews.find((r: Review) => r.animeId === parseInt(animeId));
        
        if (existingReview) {
          setIsEditing(true);
          setExistingReview(existingReview);
          setFormData({
            rating: existingReview.rating,
            storyRating: existingReview.storyRating || 0,
            animationRating: existingReview.animationRating || 0,
            soundRating: existingReview.soundRating || 0,
            characterRating: existingReview.characterRating || 0,
            enjoymentRating: existingReview.enjoymentRating || 0,
            title: existingReview.title,
            body: existingReview.body,
            spoilers: existingReview.spoilers,
            watchStatus: existingReview.watchStatus,
            episodesWatched: existingReview.episodesWatched || 0,
            tags: existingReview.tags || [],
            pros: existingReview.pros || '',
            cons: existingReview.cons || '',
            recommendation: existingReview.recommendation || 'recommend'
          });
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [animeId]);

  // saveDraft function with useCallback - FIXED: Memoized to prevent infinite loop
  const saveDraft = useCallback(async () => {
    if (!hasUnsavedChanges.current) return;
    
    setSaving(true);
    try {
      const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
      const draftReview: Review = {
        id: existingReview?.id || `review_${Date.now()}`,
        animeId: parseInt(animeId),
        userId: 'current_user', // In real app, get from auth context
        ...formData,
        status: 'draft',
        createdAt: existingReview?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        helpfulVotes: existingReview?.helpfulVotes || 0
      };

      const existingIndex = reviews.findIndex((r: Review) => r.id === draftReview.id);
      if (existingIndex >= 0) {
        reviews[existingIndex] = draftReview;
      } else {
        reviews.push(draftReview);
      }

      localStorage.setItem('reviews', JSON.stringify(reviews));
      setLastSaved(new Date());
      hasUnsavedChanges.current = false;
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setSaving(false);
    }
  }, [formData, animeId, existingReview]);

  // Auto-save functionality - TEMPORARILY DISABLED TO DEBUG INFINITE LOOP
  // useEffect(() => {
  //   if (!hasUnsavedChanges.current) return;

  //   if (autoSaveRef.current) {
  //     clearTimeout(autoSaveRef.current);
  //   }

  //   autoSaveRef.current = setTimeout(() => {
  //     saveDraft();
  //   }, 30000); // Auto-save every 30 seconds

  //   return () => {
  //     if (autoSaveRef.current) {
  //       clearTimeout(autoSaveRef.current);
  //     }
  //   };
  // }, [formData, saveDraft]); // Proper dependencies

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.rating === 0) {
      newErrors.rating = 'Rating is required';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Review title is required';
    }
    if (formData.title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }
    if (formData.body.length < 100) {
      newErrors.body = 'Review must be at least 100 characters';
    }
    if (formData.body.length > 10000) {
      newErrors.body = 'Review must be 10,000 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const publishReview = async () => {
    if (!validateForm()) {
      return;
    }

    setPublishing(true);
    try {
      const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
      const publishedReview: Review = {
        id: existingReview?.id || `review_${Date.now()}`,
        animeId: parseInt(animeId),
        userId: 'current_user',
        ...formData,
        status: 'published',
        createdAt: existingReview?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        helpfulVotes: existingReview?.helpfulVotes || 0
      };

      const existingIndex = reviews.findIndex((r: Review) => r.id === publishedReview.id);
      if (existingIndex >= 0) {
        reviews[existingIndex] = publishedReview;
      } else {
        reviews.push(publishedReview);
      }

      localStorage.setItem('reviews', JSON.stringify(reviews));
      
      // Show success message and redirect
      alert('Review published successfully!');
      router.push(`/anime/${animeId}`);
    } catch (error) {
      console.error('Error publishing review:', error);
    } finally {
      setPublishing(false);
      setShowPublishModal(false);
    }
  };

  const handleInputChange = (field: keyof ReviewFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    hasUnsavedChanges.current = true;
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim()) && formData.tags.length < 5) {
      handleInputChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const calculateAverageRating = () => {
    const ratings = [
      formData.storyRating,
      formData.animationRating,
      formData.soundRating,
      formData.characterRating,
      formData.enjoymentRating
    ].filter(rating => rating > 0);
    
    if (ratings.length === 0) return 0;
    return Math.round(ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length);
  };

  const StarRating = ({ 
    rating, 
    onRatingChange, 
    maxRating = 10, 
    size = 'md' 
  }: { 
    rating: number; 
    onRatingChange: (rating: number) => void; 
    maxRating?: number;
    size?: 'sm' | 'md' | 'lg';
  }) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8'
    };

    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: maxRating }, (_, i) => (
          <button
            key={i}
            onClick={() => onRatingChange(i + 1)}
            className={`${sizeClasses[size]} transition-colors ${
              i < rating ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-300'
            }`}
          >
            <Star />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-300">{rating}/{maxRating}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Anime Not Found</h2>
          <p className="text-gray-400 mb-4">The anime you're looking for doesn't exist.</p>
          <Link href="/search" className="text-red-400 hover:text-red-300">
            Search for anime
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900/20 via-black to-green-900/20 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link 
                href={`/anime/${animeId}`}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
              <div className="w-12 h-16 sm:w-16 sm:h-20 rounded-lg overflow-hidden bg-gray-800">
                <Image
                  src={anime.images.jpg.large_image_url}
                  alt={anime.title}
                  width={64}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {isEditing ? 'Edit Review' : 'Write Review'}
                </h1>
                <p className="text-sm sm:text-base text-gray-300 truncate max-w-[200px] sm:max-w-full">{anime.title_english || anime.title}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4 mt-2 sm:mt-0">
              {lastSaved && (
                <div className="hidden sm:flex items-center space-x-2 text-green-400 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
                </div>
              )}
              <button
                onClick={saveDraft}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Draft</span>
              </button>
              <button
                onClick={() => setShowPublishModal(true)}
                disabled={formData.rating === 0 || !formData.title.trim() || formData.body.length < 100}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-3 sm:px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
              >
                <Send className="w-4 h-4" />
                <span>{isEditing ? 'Update' : 'Publish'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Rating Section */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Overall Rating *</h2>
              <div className="space-y-4">
                <StarRating
                  rating={formData.rating}
                  onRatingChange={(rating) => handleInputChange('rating', rating)}
                  maxRating={5}
                  size="lg"
                />
                {errors.rating && (
                  <p className="text-red-400 text-sm">{errors.rating}</p>
                )}
              </div>
            </div>

            {/* Detailed Ratings */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Detailed Ratings (Optional)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: 'storyRating', label: 'Story' },
                  { key: 'animationRating', label: 'Animation' },
                  { key: 'soundRating', label: 'Sound' },
                  { key: 'characterRating', label: 'Characters' },
                  { key: 'enjoymentRating', label: 'Enjoyment' }
                ].map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
                    <StarRating
                      rating={formData[key as keyof ReviewFormData] as number}
                      onRatingChange={(rating) => handleInputChange(key as keyof ReviewFormData, rating)}
                      maxRating={5}
                      size="md"
                    />
                  </div>
                ))}
              </div>
              {calculateAverageRating() > 0 && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-400 text-sm">
                    Calculated average: {calculateAverageRating()}/5
                    {formData.rating !== calculateAverageRating() && (
                      <button
                        onClick={() => handleInputChange('rating', calculateAverageRating())}
                        className="ml-2 text-green-300 hover:text-green-200 underline"
                      >
                        Use this as overall rating
                      </button>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Review Title */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <label className="block text-xl font-bold text-white mb-4">
                Review Title *
                <span className="text-red-400 ml-1">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Summarize your thoughts in one line"
                maxLength={100}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200"
              />
              <div className="flex justify-between items-center mt-2">
                {errors.title && (
                  <p className="text-red-400 text-sm">{errors.title}</p>
                )}
                <p className="text-gray-400 text-sm ml-auto">
                  {formData.title.length}/100 characters
                </p>
              </div>
            </div>

            {/* Review Body */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-xl font-bold text-white">
                  Review Body *
                  <span className="text-red-400 ml-1">*</span>
                </label>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
                </button>
              </div>
              
              {!showPreview ? (
                <div>
                  <textarea
                    value={formData.body}
                    onChange={(e) => handleInputChange('body', e.target.value)}
                    placeholder="Write your detailed review here..."
                    rows={12}
                    maxLength={10000}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200 resize-none"
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.body && (
                      <p className="text-red-400 text-sm">{errors.body}</p>
                    )}
                    <p className="text-gray-400 text-sm ml-auto">
                      {formData.body.length}/10,000 characters
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/20 rounded-lg p-4 min-h-[300px]">
                  <h3 className="text-lg font-semibold text-white mb-2">{formData.title || 'Review Title'}</h3>
                  <div className="flex items-center space-x-2 mb-4">
                    <StarRating
                      rating={formData.rating}
                      onRatingChange={() => {}}
                      maxRating={5}
                      size="sm"
                    />
                    <span className="text-gray-400 text-sm">by You</span>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 whitespace-pre-wrap">{formData.body || 'Your review content will appear here...'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Options */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Additional Information</h2>
              
              <div className="space-y-6">
                {/* Watch Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Watch Status *</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: 'completed', label: 'Completed' },
                      { value: 'watching', label: 'Watching' },
                      { value: 'dropped', label: 'Dropped' },
                      { value: 'plan-to-watch', label: 'Plan to Watch' }
                    ].map(({ value, label }) => (
                      <label key={value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="watchStatus"
                          value={value}
                          checked={formData.watchStatus === value}
                          onChange={(e) => handleInputChange('watchStatus', e.target.value)}
                          className="w-4 h-4 text-red-600 bg-white/10 border-white/20 focus:ring-red-500"
                        />
                        <span className="text-white text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Episodes Watched */}
                {anime.episodes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Episodes Watched (Optional)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        min="0"
                        max={anime.episodes}
                        value={formData.episodesWatched}
                        onChange={(e) => handleInputChange('episodesWatched', parseInt(e.target.value) || 0)}
                        className="w-20 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                      />
                      <span className="text-gray-400">out of {anime.episodes} episodes</span>
                    </div>
                  </div>
                )}

                {/* Spoiler Warning */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="spoilers"
                    checked={formData.spoilers}
                    onChange={(e) => handleInputChange('spoilers', e.target.checked)}
                    className="w-4 h-4 text-red-600 bg-white/10 border-white/20 rounded focus:ring-red-500"
                  />
                  <label htmlFor="spoilers" className="text-white text-sm cursor-pointer">
                    This review contains spoilers
                  </label>
                  {formData.spoilers && (
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags (Optional) - Max 5
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm flex items-center space-x-1"
                      >
                        <span>{tag}</span>
                        <button
                          onClick={() => removeTag(tag)}
                          className="text-green-300 hover:text-green-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      placeholder="Add a tag..."
                      className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    />
                    <button
                      onClick={addTag}
                      disabled={!newTag.trim() || formData.tags.length >= 5}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="mt-2">
                    <p className="text-gray-400 text-xs mb-2">Popular tags:</p>
                    <div className="flex flex-wrap gap-1">
                      {popularTags.slice(0, 8).map((tag) => (
                        <button
                          key={tag}
                          onClick={() => {
                            if (!formData.tags.includes(tag) && formData.tags.length < 5) {
                              handleInputChange('tags', [...formData.tags, tag]);
                            }
                          }}
                          disabled={formData.tags.includes(tag) || formData.tags.length >= 5}
                          className="px-2 py-1 bg-white/5 hover:bg-white/10 disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-300 hover:text-white text-xs rounded transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Recommendation</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { value: 'highly-recommend', label: 'Highly Recommend', color: 'text-green-400' },
                      { value: 'recommend', label: 'Recommend', color: 'text-green-300' },
                      { value: 'mixed', label: 'Mixed Feelings', color: 'text-yellow-400' },
                      { value: 'not-recommend', label: 'Not Recommended', color: 'text-orange-400' },
                      { value: 'strongly-not-recommend', label: 'Strongly Not Recommended', color: 'text-red-400' }
                    ].map(({ value, label, color }) => (
                      <label key={value} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="recommendation"
                          value={value}
                          checked={formData.recommendation === value}
                          onChange={(e) => handleInputChange('recommendation', e.target.value)}
                          className="w-4 h-4 text-red-600 bg-white/10 border-white/20 focus:ring-red-500"
                        />
                        <span className={`text-sm ${color}`}>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Anime Info */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Anime Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white">{anime.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-white">{anime.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Year:</span>
                  <span className="text-white">{anime.year}</span>
                </div>
                {anime.episodes && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Episodes:</span>
                    <span className="text-white">{anime.episodes}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-400">Genres:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {anime.genres.slice(0, 3).map((genre) => (
                      <span key={genre.mal_id} className="px-2 py-1 bg-white/10 text-xs rounded text-gray-300">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Pros & Cons (Optional)</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">What did you like?</label>
                  <textarea
                    value={formData.pros}
                    onChange={(e) => handleInputChange('pros', e.target.value)}
                    placeholder="List the things you enjoyed..."
                    rows={3}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">What didn't you like?</label>
                  <textarea
                    value={formData.cons}
                    onChange={(e) => handleInputChange('cons', e.target.value)}
                    placeholder="List the things you didn't enjoy..."
                    rows={3}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Publish Confirmation Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/20 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">
              {isEditing ? 'Update Review' : 'Publish Review'}
            </h3>
            <p className="text-gray-300 mb-6">
              {isEditing 
                ? 'Your review will be updated and visible to all users.'
                : 'Your review will be public and visible to all users.'
              }
            </p>
            <div className="flex items-center space-x-2 mb-6">
              <input
                type="checkbox"
                id="guidelines"
                checked={agreedToGuidelines}
                onChange={(e) => setAgreedToGuidelines(e.target.checked)}
                className="w-4 h-4 text-red-600 bg-white/10 border-white/20 rounded focus:ring-red-500"
              />
              <label htmlFor="guidelines" className="text-white text-sm cursor-pointer">
                I agree this review follows community guidelines
              </label>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPublishModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={publishReview}
                disabled={!agreedToGuidelines || publishing}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>{isEditing ? 'Update' : 'Publish'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
