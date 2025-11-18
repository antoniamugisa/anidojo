'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getReviews, deleteReview } from '@/lib/supabase/queries';
import type { Review as ReviewType } from '@/types/database';
import { 
  Star, 
  Trash2, 
  ThumbsUp, 
  Loader2,
  Clock,
  BookOpen,
  MoreVertical,
  Share2,
  Edit3
} from 'lucide-react';

// Types - Review interface is now imported from types/database
interface ReviewDisplay extends ReviewType {
  animeTitle?: string;
  animeImage?: string;
}

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<ReviewDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpenId(null);
      }
    };

    if (menuOpenId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpenId]);

  // Load reviews
  useEffect(() => {
    const loadReviews = async () => {
      // Wait for auth to finish loading
      if (authLoading) {
        return;
      }

      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Limit to 100 reviews for performance
        const dbReviews = await getReviews(undefined, user.id, undefined, 100);
        
        // Convert DB reviews to display format
        const reviewsWithAnimeData: ReviewDisplay[] = dbReviews.map((review: any) => ({
          id: review.id,
          user_id: review.user_id,
          anime_id: review.anime_id,
          rating: review.rating,
          story_rating: review.story_rating,
          animation_rating: review.animation_rating,
          sound_rating: review.sound_rating,
          character_rating: review.character_rating,
          enjoyment_rating: review.enjoyment_rating,
          title: review.title,
          body: review.body,
          spoilers: review.spoilers,
          watch_status: review.watch_status,
          episodes_watched: review.episodes_watched,
          tags: review.tags,
          pros: review.pros,
          cons: review.cons,
          recommendation: review.recommendation,
          status: review.status,
          helpful_votes: review.helpful_votes,
          created_at: review.created_at,
          updated_at: review.updated_at,
          animeTitle: `Anime ${review.anime_id}`, // TODO: Fetch from API
          animeImage: '/images/placeholder-anime.jpg' // TODO: Fetch from API
        }));
        
        setReviews(reviewsWithAnimeData);
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  const handleDeleteReview = async (reviewId: string) => {
    setDeleting(true);
    setMenuOpenId(null);
    try {
      await deleteReview(reviewId);
      const updatedReviews = reviews.filter(r => r.id !== reviewId);
      setReviews(updatedReviews);
      if (expandedReviewId === reviewId) {
        setExpandedReviewId(null);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const handleEditReview = (review: ReviewDisplay) => {
    setMenuOpenId(null);
    router.push(`/anime/${review.anime_id}/review`);
  };

  const handleShareReview = async (review: ReviewDisplay) => {
    setMenuOpenId(null);
    const url = `${window.location.origin}/anime/${review.anime_id}`;
    try {
      await navigator.clipboard.writeText(url);
      alert('Review link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
      alert('Failed to copy link. Please try again.');
    }
  };

  const toggleReview = (reviewId: string) => {
    setExpandedReviewId(prev => prev === reviewId ? null : reviewId);
    setMenuOpenId(null);
  };

  const StarRating = ({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) => {
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
              i < rating ? 'text-red-500 fill-current' : 'text-gray-400'
            }`}
          />
        ))}
        <span className="text-sm text-gray-300 ml-1">{rating}/10</span>
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    if (status === 'published') {
      return (
        <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center space-x-1">
          <span>Published</span>
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full flex items-center space-x-1">
        <Clock className="w-3 h-3" />
        <span>Draft</span>
      </span>
    );
  };

  const getRecommendationBadge = (recommendation?: string) => {
    if (!recommendation) return null;
    
    const badges = {
      'highly-recommend': { label: 'Highly Recommend', color: 'bg-green-500/20 text-green-400' },
      'recommend': { label: 'Recommend', color: 'bg-green-500/20 text-green-400' },
      'mixed': { label: 'Mixed', color: 'bg-yellow-500/20 text-yellow-400' },
      'not-recommend': { label: 'Not Recommend', color: 'bg-orange-500/20 text-orange-400' },
      'strongly-not-recommend': { label: 'Strongly Not Recommend', color: 'bg-red-500/20 text-red-400' }
    };
    
    const badge = badges[recommendation as keyof typeof badges];
    if (!badge) return null;
    
    return (
      <span className={`px-2 py-1 ${badge.color} text-xs rounded-full`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading your reviews...</p>
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
        <span className="text-white">My Reviews</span>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-red-900/20 via-black to-green-900/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-white">Reviews</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Reviews Found</h3>
            <p className="text-gray-400 mb-6">Start writing your first anime review!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {reviews.map((review) => {
              const isExpanded = expandedReviewId === review.id;
              const isMenuOpen = menuOpenId === review.id;

              return (
                <div
                  key={review.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:border-red-500/50 transition-all duration-300"
                >
                  {/* Collapsed/Header View */}
                  <div
                    onClick={() => toggleReview(review.id)}
                    className="p-4 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white truncate">
                            {review.title}
                          </h3>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            {getStatusBadge(review.status)}
                            {getRecommendationBadge(review.recommendation)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span>{review.animeTitle}</span>
                          <StarRating rating={review.rating} />
                          <span>{new Date(review.updated_at).toLocaleDateString()}</span>
                          {review.status === 'published' && (
                            <div className="flex items-center space-x-1">
                              <ThumbsUp className="w-4 h-4" />
                              <span>{review.helpful_votes} helpful</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded View */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-white/10 pt-4">
                      <div className="relative">
                        {/* 3-Dot Menu */}
                        <div className="absolute top-0 right-0" ref={menuRef}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpenId(isMenuOpen ? null : review.id);
                            }}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-400" />
                          </button>

                          {/* Menu Dropdown */}
                          {isMenuOpen && (
                            <div className="absolute right-0 top-10 bg-gray-900 border border-white/20 rounded-lg shadow-lg z-10 min-w-[150px]">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditReview(review);
                                }}
                                className="w-full px-4 py-2 text-left text-white hover:bg-white/10 flex items-center space-x-2 rounded-t-lg"
                              >
                                <Edit3 className="w-4 h-4" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShareReview(review);
                                }}
                                className="w-full px-4 py-2 text-left text-white hover:bg-white/10 flex items-center space-x-2"
                              >
                                <Share2 className="w-4 h-4" />
                                <span>Share</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteReview(review.id);
                                }}
                                disabled={deleting}
                                className="w-full px-4 py-2 text-left text-red-400 hover:bg-white/10 flex items-center space-x-2 rounded-b-lg disabled:opacity-50"
                              >
                                {deleting ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Review Body */}
                        <div className="pr-12">
                          <p className="text-gray-300 text-sm mb-4 whitespace-pre-wrap">
                            {review.body}
                          </p>

                          {review.tags && review.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {review.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-1 bg-white/10 text-xs rounded text-gray-300"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {review.pros && (
                            <div className="mb-3">
                              <h4 className="text-sm font-semibold text-green-400 mb-1">Pros:</h4>
                              <p className="text-gray-300 text-sm">{review.pros}</p>
                            </div>
                          )}

                          {review.cons && (
                            <div className="mb-3">
                              <h4 className="text-sm font-semibold text-red-400 mb-1">Cons:</h4>
                              <p className="text-gray-300 text-sm">{review.cons}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
