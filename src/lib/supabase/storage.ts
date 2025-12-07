import { createClient } from './client';
import { createClient as createServerClient } from './server';

/**
 * Storage bucket names
 */
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  ANIME_IMAGES: 'anime-images',
  REVIEW_IMAGES: 'review-images',
} as const;

/**
 * Upload a file to Supabase Storage (client-side)
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
  options?: {
    cacheControl?: string;
    contentType?: string;
    upsert?: boolean;
  }
) {
  const supabase = createClient();
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: options?.cacheControl || '3600',
      contentType: options?.contentType || file.type,
      upsert: options?.upsert ?? false,
    });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Upload a file to Supabase Storage (server-side)
 */
export async function uploadFileServer(
  bucket: string,
  path: string,
  file: File | Buffer,
  options?: {
    cacheControl?: string;
    contentType?: string;
    upsert?: boolean;
  }
) {
  const supabase = await createServerClient();
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: options?.cacheControl || '3600',
      contentType: options?.contentType || 'application/octet-stream',
      upsert: options?.upsert ?? false,
    });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Get a public URL for a file in storage
 */
export function getPublicUrl(bucket: string, path: string): string {
  const supabase = createClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Get a signed URL for a file in storage (temporary access)
 */
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600
): Promise<string> {
  const supabase = createClient();
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) {
    throw error;
  }

  return data.signedUrl;
}

/**
 * Delete a file from storage
 */
export async function deleteFile(bucket: string, path: string) {
  const supabase = createClient();
  
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw error;
  }
}

/**
 * Delete files from storage (server-side)
 */
export async function deleteFileServer(bucket: string, path: string) {
  const supabase = await createServerClient();
  
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw error;
  }
}

/**
 * List files in a storage bucket
 */
export async function listFiles(
  bucket: string,
  path?: string,
  options?: {
    limit?: number;
    offset?: number;
    sortBy?: { column: string; order: 'asc' | 'desc' };
  }
) {
  const supabase = createClient();
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(path || '', options);

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Upload user avatar
 */
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  await uploadFile(STORAGE_BUCKETS.AVATARS, filePath, file, {
    contentType: file.type,
    upsert: false,
  });

  return getPublicUrl(STORAGE_BUCKETS.AVATARS, filePath);
}

/**
 * Delete user avatar
 */
export async function deleteAvatar(userId: string, avatarUrl: string) {
  // Extract path from URL
  const url = new URL(avatarUrl);
  const pathParts = url.pathname.split('/');
  const pathIndex = pathParts.findIndex(part => part === STORAGE_BUCKETS.AVATARS);
  
  if (pathIndex === -1) {
    throw new Error('Invalid avatar URL');
  }

  const path = pathParts.slice(pathIndex + 1).join('/');
  await deleteFile(STORAGE_BUCKETS.AVATARS, path);
}

