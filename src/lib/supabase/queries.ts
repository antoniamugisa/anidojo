import { createClient } from '@/lib/supabase/client';
import type { AnimeEntry, Review, CustomList, Comment, ReviewVote } from '@/types/database';

const supabase = createClient();

// Anime Entries
export async function getAnimeEntries(userId: string) {
  const { data, error } = await supabase
    .from('anime_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as AnimeEntry[];
}

export async function getAnimeEntry(userId: string, animeId: number) {
  const { data, error } = await supabase
    .from('anime_entries')
    .select('*')
    .eq('user_id', userId)
    .eq('anime_id', animeId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as AnimeEntry | null;
}

export async function upsertAnimeEntry(entry: Omit<AnimeEntry, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('anime_entries')
    .upsert({
      ...entry,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,anime_id',
    })
    .select()
    .single();

  if (error) throw error;
  return data as AnimeEntry;
}

export async function deleteAnimeEntry(userId: string, animeId: number) {
  const { error } = await supabase
    .from('anime_entries')
    .delete()
    .eq('user_id', userId)
    .eq('anime_id', animeId);

  if (error) throw error;
}

// Reviews
export async function getReviews(animeId?: number, userId?: string, status?: 'draft' | 'published', limit?: number) {
  let query = supabase
    .from('reviews')
    .select('*')
    .order('updated_at', { ascending: false });

  if (animeId) {
    query = query.eq('anime_id', animeId);
  }

  if (userId) {
    query = query.eq('user_id', userId);
  }

  if (status) {
    query = query.eq('status', status);
  }

  // Add limit to prevent fetching too many reviews at once
  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
}

export async function getReview(reviewId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', reviewId)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserReview(userId: string, animeId: number) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', userId)
    .eq('anime_id', animeId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as Review | null;
}

export async function upsertReview(review: Omit<Review, 'id' | 'created_at' | 'updated_at' | 'helpful_votes'> & { id?: string }) {
  console.log('upsertReview called with:', { id: review.id, user_id: review.user_id, anime_id: review.anime_id, status: review.status });
  
  // If we have an ID, update by ID
  if (review.id) {
    console.log('Updating review by ID:', review.id);
    
    // If publishing, check if there's already a published review for this user/anime
    if (review.status === 'published') {
      const { data: existingPublished } = await supabase
        .from('reviews')
        .select('id')
        .eq('user_id', review.user_id)
        .eq('anime_id', review.anime_id)
        .eq('status', 'published')
        .neq('id', review.id)
        .maybeSingle();
      
      // If there's another published review, delete it first (only one published review allowed)
      if (existingPublished) {
        console.log('Found existing published review, deleting it:', existingPublished.id);
        await supabase
          .from('reviews')
          .delete()
          .eq('id', existingPublished.id);
      }
    }
    
    const { data, error } = await supabase
      .from('reviews')
      .update({
        ...review,
        updated_at: new Date().toISOString(),
        helpful_votes: review.helpful_votes || 0,
      })
      .eq('id', review.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating review by ID:', error);
      throw error;
    }
    console.log('Review updated successfully:', data);
    return data as Review;
  }

  // If no ID, try to find existing review (could be draft or published)
  console.log('No ID provided, checking for existing review...');
  const { data: existingReviews, error: fetchError } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', review.user_id)
    .eq('anime_id', review.anime_id)
    .order('created_at', { ascending: false })
    .limit(1);

  if (fetchError) {
    console.error('Error fetching existing review:', fetchError);
    throw fetchError;
  }

  const existing = existingReviews && existingReviews.length > 0 ? existingReviews[0] : null;
  
  if (existing) {
    console.log('Found existing review, updating:', existing.id);
    // Update existing review
    const { data, error } = await supabase
      .from('reviews')
      .update({
        ...review,
        updated_at: new Date().toISOString(),
        helpful_votes: review.helpful_votes || existing.helpful_votes || 0,
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating existing review:', error);
      throw error;
    }
    console.log('Review updated successfully:', data);
    return data as Review;
  }

  // Create new review
  console.log('No existing review found, creating new review...');
  
  // If publishing, check if there's already a published review and delete it
  if (review.status === 'published') {
    const { data: existingPublished } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', review.user_id)
      .eq('anime_id', review.anime_id)
      .eq('status', 'published')
      .maybeSingle();
    
    if (existingPublished) {
      console.log('Found existing published review, deleting it:', existingPublished.id);
      await supabase
        .from('reviews')
        .delete()
        .eq('id', existingPublished.id);
    }
  }
  
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      ...review,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      helpful_votes: review.helpful_votes || 0,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating new review:', error);
    throw error;
  }
  console.log('Review created successfully:', data);
  return data as Review;
}

export async function deleteReview(reviewId: string) {
  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId);

  if (error) throw error;
}

// Review Votes
export async function voteReview(reviewId: string, userId: string, helpful: boolean) {
  const { data, error } = await supabase
    .from('review_votes')
    .upsert({
      review_id: reviewId,
      user_id: userId,
      helpful,
    }, {
      onConflict: 'review_id,user_id',
    })
    .select()
    .single();

  if (error) throw error;
  return data as ReviewVote;
}

export async function getUserReviewVote(reviewId: string, userId: string) {
  const { data, error } = await supabase
    .from('review_votes')
    .select('*')
    .eq('review_id', reviewId)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as ReviewVote | null;
}

// Comments
export async function getComments(reviewId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('review_id', reviewId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createComment(comment: Omit<Comment, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>) {
  const { data, error } = await supabase
    .from('comments')
    .insert({
      ...comment,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data as Comment;
}

export async function updateComment(commentId: string, content: string) {
  const { data, error } = await supabase
    .from('comments')
    .update({
      content,
      updated_at: new Date().toISOString(),
    })
    .eq('id', commentId)
    .select()
    .single();

  if (error) throw error;
  return data as Comment;
}

export async function deleteComment(commentId: string) {
  const { error } = await supabase
    .from('comments')
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq('id', commentId);

  if (error) throw error;
}

// Custom Lists
export async function getCustomLists(userId: string) {
  const { data, error } = await supabase
    .from('custom_lists')
    .select('*, custom_list_entries(anime_id)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createCustomList(list: Omit<CustomList, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('custom_lists')
    .insert({
      ...list,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data as CustomList;
}

export async function updateCustomList(listId: string, updates: Partial<CustomList>) {
  const { data, error } = await supabase
    .from('custom_lists')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', listId)
    .select()
    .single();

  if (error) throw error;
  return data as CustomList;
}

export async function deleteCustomList(listId: string) {
  const { error } = await supabase
    .from('custom_lists')
    .delete()
    .eq('id', listId);

  if (error) throw error;
}

export async function addAnimeToList(listId: string, animeId: number) {
  const { data, error } = await supabase
    .from('custom_list_entries')
    .insert({
      list_id: listId,
      anime_id: animeId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeAnimeFromList(listId: string, animeId: number) {
  const { error } = await supabase
    .from('custom_list_entries')
    .delete()
    .eq('list_id', listId)
    .eq('anime_id', animeId);

  if (error) throw error;
}

