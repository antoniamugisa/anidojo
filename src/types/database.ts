// Database types matching Supabase schema

export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export interface AnimeEntry {
  id: string;
  user_id: string;
  anime_id: number;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  image: string | null;
  type: string | null;
  episodes: number | null;
  status: 'watching' | 'completed' | 'on-hold' | 'dropped' | 'plan-to-watch';
  episodes_watched: number;
  score: number | null;
  start_date: string | null;
  finish_date: string | null;
  notes: string | null;
  tags: string[];
  favorite: boolean;
  rewatch_count: number;
  priority: 'low' | 'medium' | 'high' | null;
  genres: string[];
  year: number | null;
  rating: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  anime_id: number;
  rating: number;
  story_rating: number | null;
  animation_rating: number | null;
  sound_rating: number | null;
  character_rating: number | null;
  enjoyment_rating: number | null;
  title: string;
  body: string;
  spoilers: boolean;
  watch_status: 'completed' | 'watching' | 'dropped' | 'plan-to-watch';
  episodes_watched: number | null;
  tags: string[];
  pros: string | null;
  cons: string | null;
  recommendation: 'highly-recommend' | 'recommend' | 'mixed' | 'not-recommend' | 'strongly-not-recommend' | null;
  status: 'draft' | 'published';
  helpful_votes: number;
  created_at: string;
  updated_at: string;
}

export interface ReviewVote {
  id: string;
  review_id: string;
  user_id: string;
  helpful: boolean;
  created_at: string;
}

export interface Comment {
  id: string;
  review_id: string;
  user_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CommentVote {
  id: string;
  comment_id: string;
  user_id: string;
  upvote: boolean;
  created_at: string;
}

export interface CustomList {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomListEntry {
  id: string;
  list_id: string;
  anime_id: number;
  created_at: string;
}

// Extended types with joined data
export interface ReviewWithProfile extends Review {
  profiles: Profile;
}

export interface CommentWithProfile extends Comment {
  profiles: Profile;
  replies?: CommentWithProfile[];
}

export interface AnimeEntryWithAnime extends AnimeEntry {
  // Can be extended with anime data from external API
}

