import { createClient } from '@/lib/supabase/client';
import type { AnimeEntry, Review, CustomList } from '@/types/database';

interface LocalStorageAnimeEntry {
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

interface LocalStorageReview {
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

interface LocalStorageCustomList {
  id: string;
  name: string;
  description?: string;
  animeIds: number[];
  createdAt: string;
  isPublic: boolean;
}

export interface MigrationResult {
  success: boolean;
  errors: string[];
  stats: {
    animeEntries: { migrated: number; failed: number };
    reviews: { migrated: number; failed: number };
    customLists: { migrated: number; failed: number };
  };
}

export async function migrateLocalStorageToSupabase(userId: string): Promise<MigrationResult> {
  const supabase = createClient();
  const result: MigrationResult = {
    success: true,
    errors: [],
    stats: {
      animeEntries: { migrated: 0, failed: 0 },
      reviews: { migrated: 0, failed: 0 },
      customLists: { migrated: 0, failed: 0 },
    },
  };

  try {
    // Migrate anime entries
    const animeEntriesJson = localStorage.getItem('animeEntries');
    if (animeEntriesJson) {
      try {
        const entries: LocalStorageAnimeEntry[] = JSON.parse(animeEntriesJson);
        
        for (const entry of entries) {
          try {
            const { error } = await supabase.from('anime_entries').upsert({
              user_id: userId,
              anime_id: entry.animeId,
              title: entry.title,
              title_english: entry.titleEnglish || null,
              title_japanese: entry.titleJapanese || null,
              image: entry.image || null,
              type: entry.type || null,
              episodes: entry.episodes || null,
              status: entry.status,
              episodes_watched: entry.episodesWatched,
              score: entry.score || null,
              start_date: entry.startDate || null,
              finish_date: entry.finishDate || null,
              notes: entry.notes || null,
              tags: entry.tags || [],
              favorite: entry.favorite || false,
              rewatch_count: entry.rewatchCount || 0,
              priority: entry.priority || null,
              genres: entry.genres || [],
              year: entry.year || null,
              rating: entry.rating || null,
              created_at: entry.dateAdded || new Date().toISOString(),
              updated_at: entry.lastUpdated || new Date().toISOString(),
            }, {
              onConflict: 'user_id,anime_id',
            });

            if (error) {
              result.stats.animeEntries.failed++;
              result.errors.push(`Failed to migrate anime entry ${entry.animeId}: ${error.message}`);
            } else {
              result.stats.animeEntries.migrated++;
            }
          } catch (error) {
            result.stats.animeEntries.failed++;
            result.errors.push(`Error migrating anime entry ${entry.animeId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      } catch (error) {
        result.errors.push(`Failed to parse anime entries: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Migrate reviews
    const reviewsJson = localStorage.getItem('reviews');
    if (reviewsJson) {
      try {
        const reviews: LocalStorageReview[] = JSON.parse(reviewsJson);
        const userReviews = reviews.filter(r => r.userId === 'current_user' || r.userId === userId);
        
        for (const review of userReviews) {
          try {
            const { error } = await supabase.from('reviews').upsert({
              id: review.id,
              user_id: userId,
              anime_id: review.animeId,
              rating: review.rating,
              story_rating: review.storyRating || null,
              animation_rating: review.animationRating || null,
              sound_rating: review.soundRating || null,
              character_rating: review.characterRating || null,
              enjoyment_rating: review.enjoymentRating || null,
              title: review.title,
              body: review.body,
              spoilers: review.spoilers,
              watch_status: review.watchStatus,
              episodes_watched: review.episodesWatched || null,
              tags: review.tags || [],
              pros: review.pros || null,
              cons: review.cons || null,
              recommendation: review.recommendation || null,
              status: review.status,
              helpful_votes: review.helpfulVotes || 0,
              created_at: review.createdAt || new Date().toISOString(),
              updated_at: review.updatedAt || new Date().toISOString(),
            }, {
              onConflict: 'id',
            });

            if (error) {
              result.stats.reviews.failed++;
              result.errors.push(`Failed to migrate review ${review.id}: ${error.message}`);
            } else {
              result.stats.reviews.migrated++;
            }
          } catch (error) {
            result.stats.reviews.failed++;
            result.errors.push(`Error migrating review ${review.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      } catch (error) {
        result.errors.push(`Failed to parse reviews: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Migrate custom lists
    const customListsJson = localStorage.getItem('customLists');
    if (customListsJson) {
      try {
        const lists: LocalStorageCustomList[] = JSON.parse(customListsJson);
        
        for (const list of lists) {
          try {
            // Create the list
            const { data: listData, error: listError } = await supabase
              .from('custom_lists')
              .upsert({
                id: list.id,
                user_id: userId,
                name: list.name,
                description: list.description || null,
                is_public: list.isPublic || false,
                created_at: list.createdAt || new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }, {
                onConflict: 'id',
              })
              .select()
              .single();

            if (listError) {
              result.stats.customLists.failed++;
              result.errors.push(`Failed to migrate custom list ${list.id}: ${listError.message}`);
              continue;
            }

            // Migrate list entries
            if (listData && list.animeIds.length > 0) {
              const entries = list.animeIds.map(animeId => ({
                list_id: listData.id,
                anime_id: animeId,
              }));

              const { error: entriesError } = await supabase
                .from('custom_list_entries')
                .upsert(entries, {
                  onConflict: 'list_id,anime_id',
                });

              if (entriesError) {
                result.errors.push(`Failed to migrate entries for list ${list.id}: ${entriesError.message}`);
              }
            }

            result.stats.customLists.migrated++;
          } catch (error) {
            result.stats.customLists.failed++;
            result.errors.push(`Error migrating custom list ${list.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      } catch (error) {
        result.errors.push(`Failed to parse custom lists: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    // Mark migration as complete in localStorage
    if (result.errors.length === 0) {
      localStorage.setItem('migration_completed', 'true');
      localStorage.setItem('migration_date', new Date().toISOString());
    }

    result.success = result.errors.length === 0;
  } catch (error) {
    result.success = false;
    result.errors.push(`Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return result;
}

export function hasLocalStorageData(): boolean {
  const animeEntries = localStorage.getItem('animeEntries');
  const reviews = localStorage.getItem('reviews');
  const customLists = localStorage.getItem('customLists');
  
  return !!(animeEntries || reviews || customLists);
}

export function isMigrationCompleted(): boolean {
  return localStorage.getItem('migration_completed') === 'true';
}

