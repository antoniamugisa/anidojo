'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { getReviews, deleteReview } from '@/lib/supabase/queries';
import { getAnimeById } from '@/lib/animeApi';
import type { Review as ReviewType } from '@/types/database';
import { 
  Star, 
  Trash2, 
  ThumbsUp, 
  Loader2,
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
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
  const auth = useAuth();
  const user = auth?.user ?? null;
  const authLoading = auth?.loading ?? true;
  
  // Debug auth state
  useEffect(() => {
    console.log('Auth state changed:', { 
      hasAuth: !!auth, 
      hasUser: !!user, 
      userId: user?.id, 
      authLoading,
      isAuthenticated: auth?.isAuthenticated 
    });
  }, [auth, user, authLoading]);

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
    let timeoutId: NodeJS.Timeout | null = null;
    let isMounted = true;
    
    const loadReviews = async () => {
      console.log('loadReviews called', { authLoading, hasUser: !!user, userId: user?.id });
      
      // If we have a user, we can proceed immediately even if authLoading is true
      // (authLoading might be stuck, but if we have user data, we can use it)
      if (user?.id) {
        console.log('User found, loading reviews immediately');
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        
        setLoading(true);
        const startTime = Date.now();
        
        try {
          // Limit to 100 reviews for performance
          console.log('Calling getReviews...');
          const dbReviews = await getReviews(undefined, user.id, undefined, 100);
          console.log(`getReviews completed in ${Date.now() - startTime}ms, got ${dbReviews?.length || 0} reviews`);
          
          if (!isMounted) return;
          
          if (!dbReviews) {
            console.warn('getReviews returned null/undefined');
            setReviews([]);
            return;
          }
          
        // Convert DB reviews to display format with placeholder data first
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
          animeTitle: `Anime ${review.anime_id}`,
          animeImage: '/images/placeholder-anime.jpg'
        }));
        
        // Show reviews immediately with placeholder data
        console.log(`Setting ${reviewsWithAnimeData.length} reviews, total time: ${Date.now() - startTime}ms`);
        setReviews(reviewsWithAnimeData);
        
        // Fetch anime data sequentially to avoid rate limiting
        // Update each review as its data loads
        for (let i = 0; i < reviewsWithAnimeData.length; i++) {
          const review = reviewsWithAnimeData[i];
          if (!isMounted) break;
          
          try {
            const animeData = await getAnimeById(review.anime_id);
            if (animeData?.data && isMounted) {
              setReviews(prevReviews => {
                const updated = [...prevReviews];
                if (updated[i]) {
                  updated[i] = {
                    ...updated[i],
                    animeTitle: animeData.data.title_english || animeData.data.title,
                    animeImage: animeData.data.images?.jpg?.large_image_url || animeData.data.images?.jpg?.image_url || updated[i].animeImage
                  };
                }
                return updated;
              });
            }
          } catch (error) {
            console.warn(`Failed to fetch anime ${review.anime_id}:`, error);
            // Keep placeholder data on error
          }
        }
      } catch (error) {
        console.error('Error loading reviews:', error);
          if (isMounted) {
            setReviews([]);
          }
      } finally {
          if (isMounted) {
            setLoading(false);
            console.log(`loadReviews finished in ${Date.now() - startTime}ms`);
          }
        }
        return;
      }
      
      // No user - wait for auth to finish, but with timeout
      if (authLoading) {
        console.log('Auth still loading, waiting...');
        // Set a timeout - if auth is still loading after 1.5 seconds, proceed anyway
        timeoutId = setTimeout(() => {
          console.warn('Auth loading timeout after 1.5s, proceeding with no user');
          if (isMounted) {
        setLoading(false);
            setReviews([]);
          }
        }, 1500);
        return;
      }

      // Auth finished but no user
      console.log('No user after auth finished, setting loading to false');
      setLoading(false);
      setReviews([]);
    };

    loadReviews();
    
    // Cleanup timeout on unmount or dependency change
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [user?.id, authLoading]);

  const handleDeleteReview = async (reviewId: string) => {
    setDeleting(true);
    setMenuOpenId(null);
    try {
      await deleteReview(reviewId);
      const updatedReviews = reviews.filter(r => r.id !== reviewId);
      setReviews(updatedReviews);
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
          <div className="space-y-4">
            {reviews.map((review) => {
              const isMenuOpen = menuOpenId === review.id;

              return (
                <div
                  key={review.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:border-red-500/50 transition-all duration-300 p-6"
                >
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

                  {/* Review Content */}
                    <div className="flex gap-4 pr-12">
                      {/* Anime Image */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-32 rounded-lg overflow-hidden bg-gray-800">
                          <Image
                            src={review.animeImage || '/images/placeholder-anime.jpg'}
                            alt={review.animeTitle || 'Anime'}
                            width={96}
                            height={128}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        </div>
                      </div>

                      {/* Review Details */}
                  <div className="flex-1 min-w-0">
                        {/* Anime Title */}
                        <h2 className="text-xl font-bold text-white mb-2">
                          {review.animeTitle || `Anime ${review.anime_id}`}
                        </h2>

                        {/* Review Title */}
                        <h3 className="text-lg font-semibold text-gray-300 mb-3">
                          {review.title}
                        </h3>

                        {/* Rating and Date */}
                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                      <StarRating rating={review.rating} />
                          <span>{new Date(review.updated_at).toLocaleDateString()}</span>
                      {review.status === 'published' && (
                            <div className="flex items-center space-x-1">
                          <ThumbsUp className="w-4 h-4" />
                              <span>{review.helpful_votes} helpful</span>
                        </div>
                      )}
                    </div>

                        {/* Review Body */}
                        <div className="mb-4">
                          <p className="text-gray-300 text-sm whitespace-pre-wrap">
                      {review.body}
                    </p>
                        </div>

                        {/* Tags */}
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

                        {/* Pros and Cons */}
                        <div className="space-y-3">
                          {review.pros && (
                            <div>
                              <h4 className="text-sm font-semibold text-green-400 mb-1">Pros:</h4>
                              <p className="text-gray-300 text-sm">{review.pros}</p>
                      </div>
                    )}

                          {review.cons && (
                            <div>
                              <h4 className="text-sm font-semibold text-red-400 mb-1">Cons:</h4>
                              <p className="text-gray-300 text-sm">{review.cons}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
