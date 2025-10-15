'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Star, 
  Edit3, 
  Trash2, 
  Eye, 
  Filter, 
  Search, 
  Calendar, 
  ThumbsUp, 
  MessageCircle, 
  TrendingUp, 
  BarChart3, 
  Download, 
  CheckSquare, 
  Square, 
  AlertTriangle, 
  Loader2,
  Plus,
  Clock,
  Award,
  Target,
  BookOpen
} from 'lucide-react';

// Types
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
  animeTitle?: string;
  animeImage?: string;
}

interface ReviewStats {
  totalReviews: number;
  averageScore: number;
  mostReviewedGenre: string;
  reviewsThisMonth: number;
  reviewsThisYear: number;
  totalHelpfulVotes: number;
  ratingDistribution: Record<number, number>;
}

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'drafts'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest-rated' | 'lowest-rated' | 'most-helpful'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  
  const router = useRouter();

  // Load reviews and calculate stats
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const savedReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        const userReviews = savedReviews.filter((review: Review) => review.userId === 'current_user');
        
        // Add anime data to reviews (in real app, this would come from API)
        const reviewsWithAnimeData = userReviews.map((review: Review) => ({
          ...review,
          animeTitle: `Anime ${review.animeId}`, // Mock data
          animeImage: '/images/placeholder-anime.jpg' // Mock data
        }));
        
        setReviews(reviewsWithAnimeData);
        setFilteredReviews(reviewsWithAnimeData);
        
        // Calculate stats
        const calculatedStats = calculateStats(reviewsWithAnimeData);
        setStats(calculatedStats);
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  // Filter and sort reviews
  useEffect(() => {
    let filtered = reviews;

    // Filter by tab
    if (activeTab === 'published') {
      filtered = filtered.filter(review => review.status === 'published');
    } else if (activeTab === 'drafts') {
      filtered = filtered.filter(review => review.status === 'draft');
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(review => 
        review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.animeTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.body.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort reviews
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'oldest':
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        case 'highest-rated':
          return b.rating - a.rating;
        case 'lowest-rated':
          return a.rating - b.rating;
        case 'most-helpful':
          return b.helpfulVotes - a.helpfulVotes;
        default:
          return 0;
      }
    });

    setFilteredReviews(filtered);
  }, [reviews, activeTab, sortBy, searchQuery]);

  const calculateStats = (reviews: Review[]): ReviewStats => {
    const publishedReviews = reviews.filter(r => r.status === 'published');
    const totalReviews = publishedReviews.length;
    const averageScore = totalReviews > 0 
      ? publishedReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
      : 0;
    
    const reviewsThisMonth = publishedReviews.filter(r => {
      const reviewDate = new Date(r.createdAt);
      const now = new Date();
      return reviewDate.getMonth() === now.getMonth() && 
             reviewDate.getFullYear() === now.getFullYear();
    }).length;
    
    const reviewsThisYear = publishedReviews.filter(r => {
      const reviewDate = new Date(r.createdAt);
      const now = new Date();
      return reviewDate.getFullYear() === now.getFullYear();
    }).length;
    
    const totalHelpfulVotes = publishedReviews.reduce((sum, r) => sum + r.helpfulVotes, 0);
    
    const ratingDistribution: Record<number, number> = {};
    for (let i = 1; i <= 10; i++) {
      ratingDistribution[i] = publishedReviews.filter(r => r.rating === i).length;
    }
    
    return {
      totalReviews,
      averageScore: Math.round(averageScore * 10) / 10,
      mostReviewedGenre: 'Action', // Mock data
      reviewsThisMonth,
      reviewsThisYear,
      totalHelpfulVotes,
      ratingDistribution
    };
  };

  const handleSelectReview = (reviewId: string) => {
    setSelectedReviews(prev => 
      prev.includes(reviewId) 
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const handleSelectAll = () => {
    if (selectedReviews.length === filteredReviews.length) {
      setSelectedReviews([]);
    } else {
      setSelectedReviews(filteredReviews.map(r => r.id));
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    setDeleting(true);
    try {
      const savedReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
      const updatedReviews = savedReviews.filter((r: Review) => r.id !== reviewId);
      localStorage.setItem('reviews', JSON.stringify(updatedReviews));
      
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      setSelectedReviews(prev => prev.filter(id => id !== reviewId));
      
      // Recalculate stats
      const newStats = calculateStats(updatedReviews.filter((r: Review) => r.userId === 'current_user'));
      setStats(newStats);
    } catch (error) {
      console.error('Error deleting review:', error);
    } finally {
      setDeleting(false);
      setShowDeleteModal(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedReviews.length === 0) return;
    
    setDeleting(true);
    try {
      const savedReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
      const updatedReviews = savedReviews.filter((r: Review) => !selectedReviews.includes(r.id));
      localStorage.setItem('reviews', JSON.stringify(updatedReviews));
      
      setReviews(prev => prev.filter(r => !selectedReviews.includes(r.id)));
      setSelectedReviews([]);
      
      // Recalculate stats
      const newStats = calculateStats(updatedReviews.filter((r: Review) => r.userId === 'current_user'));
      setStats(newStats);
    } catch (error) {
      console.error('Error bulk deleting reviews:', error);
    } finally {
      setDeleting(false);
    }
  };

  const exportReviews = () => {
    const reviewsToExport = selectedReviews.length > 0 
      ? reviews.filter(r => selectedReviews.includes(r.id))
      : reviews;
    
    const exportData = reviewsToExport.map(review => ({
      title: review.title,
      animeId: review.animeId,
      rating: review.rating,
      body: review.body,
      status: review.status,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      helpfulVotes: review.helpfulVotes
    }));
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-reviews.json';
    link.click();
    URL.revokeObjectURL(url);
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
          <CheckSquare className="w-3 h-3" />
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Reviews</h1>
              <p className="text-gray-300">Manage and track your anime reviews</p>
            </div>
            <Link
              href="/search"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Write New Review</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Widget */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <BookOpen className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.totalReviews}</p>
                  <p className="text-gray-400 text-sm">Total Reviews</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.averageScore}</p>
                  <p className="text-gray-400 text-sm">Average Score</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <ThumbsUp className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.totalHelpfulVotes}</p>
                  <p className="text-gray-400 text-sm">Helpful Votes</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.reviewsThisMonth}</p>
                  <p className="text-gray-400 text-sm">This Month</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Tabs */}
            <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
              {[
                { key: 'all', label: 'All Reviews', count: reviews.length },
                { key: 'published', label: 'Published', count: reviews.filter(r => r.status === 'published').length },
                { key: 'drafts', label: 'Drafts', count: reviews.filter(r => r.status === 'draft').length }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === key
                      ? 'bg-red-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>

            {/* Search and Sort */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reviews..."
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
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest-rated">Highest Rated</option>
                <option value="lowest-rated">Lowest Rated</option>
                <option value="most-helpful">Most Helpful</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedReviews.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <p className="text-gray-300">
                  {selectedReviews.length} review{selectedReviews.length !== 1 ? 's' : ''} selected
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={exportReviews}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    disabled={deleting}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              {activeTab === 'drafts' ? 'No Drafts Found' : 'No Reviews Found'}
            </h3>
            <p className="text-gray-400 mb-6">
              {activeTab === 'drafts' 
                ? 'You don\'t have any draft reviews yet.'
                : searchQuery 
                  ? 'No reviews match your search criteria.'
                  : 'Start writing your first anime review!'
              }
            </p>
            {!searchQuery && (
              <Link
                href="/search"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Write Your First Review</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Select All */}
            <div className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg">
              <button
                onClick={handleSelectAll}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                {selectedReviews.length === filteredReviews.length ? (
                  <CheckSquare className="w-5 h-5 text-red-400" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
                <span>Select All</span>
              </button>
            </div>

            {/* Review Cards */}
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleSelectReview(review.id)}
                    className="mt-1"
                  >
                    {selectedReviews.includes(review.id) ? (
                      <CheckSquare className="w-5 h-5 text-red-400" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400 hover:text-white" />
                    )}
                  </button>

                  {/* Anime Cover */}
                  <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                    <img
                      src={review.animeImage}
                      alt={review.animeTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Review Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white line-clamp-1">
                          {review.title}
                        </h3>
                        <p className="text-gray-400 text-sm">{review.animeTitle}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(review.status)}
                        {getRecommendationBadge(review.recommendation)}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-3">
                      <StarRating rating={review.rating} />
                      <span className="text-gray-400 text-sm">
                        {new Date(review.updatedAt).toLocaleDateString()}
                      </span>
                      {review.status === 'published' && (
                        <div className="flex items-center space-x-1 text-gray-400 text-sm">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{review.helpfulVotes} helpful</span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                      {review.body}
                    </p>

                    {review.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {review.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-white/10 text-xs rounded text-gray-300">
                            {tag}
                          </span>
                        ))}
                        {review.tags.length > 3 && (
                          <span className="px-2 py-1 bg-white/10 text-xs rounded text-gray-300">
                            +{review.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <Link
                        href={`/anime/${review.animeId}`}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </Link>
                      <Link
                        href={`/anime/${review.animeId}/review`}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit</span>
                      </Link>
                      <button
                        onClick={() => setShowDeleteModal(review.id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/20 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h3 className="text-xl font-bold text-white">Delete Review</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this review? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteReview(showDeleteModal)}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
