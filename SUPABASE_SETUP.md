# Supabase Setup Guide

This guide will help you set up Supabase for authentication, database, and storage in your AniDojo application.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A new Supabase project created

## Step 1: Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Get your Supabase credentials:
   - Go to your Supabase project dashboard
   - Navigate to Settings → API
   - Copy the following values:
     - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
     - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Update `.env.local` with your credentials

## Step 2: Database Setup

The database schema is already defined in `supabase/migrations/001_initial_schema.sql`.

### Option A: Using Supabase Dashboard (Recommended for beginners)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and run the SQL script
5. Verify tables are created in the Table Editor

### Option B: Using Supabase CLI (Recommended for production)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. Run migrations:
   ```bash
   supabase db push
   ```

## Step 3: Storage Buckets Setup

Create storage buckets for file uploads:

1. Go to your Supabase project dashboard
2. Navigate to Storage
3. Create the following buckets:

   **Bucket: `avatars`**
   - Public: ✅ Yes
   - File size limit: 5 MB
   - Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`

   **Bucket: `anime-images`** (optional, for custom anime images)
   - Public: ✅ Yes
   - File size limit: 10 MB
   - Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

   **Bucket: `review-images`** (optional, for review attachments)
   - Public: ✅ Yes
   - File size limit: 10 MB
   - Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

### Storage Policies

After creating buckets, set up Row Level Security (RLS) policies:

**For `avatars` bucket:**
```sql
-- Allow public read access
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Allow authenticated users to upload their own avatars
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own avatars
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

**For `anime-images` bucket:**
```sql
-- Allow public read access
CREATE POLICY "Anime images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'anime-images');

-- Allow authenticated users to upload anime images
CREATE POLICY "Authenticated users can upload anime images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'anime-images' AND
  auth.role() = 'authenticated'
);
```

**For `review-images` bucket:**
```sql
-- Allow public read access
CREATE POLICY "Review images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'review-images');

-- Allow authenticated users to upload review images
CREATE POLICY "Authenticated users can upload review images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'review-images' AND
  auth.role() = 'authenticated'
);
```

## Step 4: Authentication Setup

### Email Authentication

Email authentication is enabled by default. Configure email templates in:
- Supabase Dashboard → Authentication → Email Templates

### Social Authentication (Optional)

To enable social providers (Google, GitHub, etc.):

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable desired providers
3. Configure OAuth credentials
4. Update your app's redirect URLs

## Step 5: Verify Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test authentication:
   - Navigate to `/signup` and create an account
   - Check Supabase Dashboard → Authentication → Users to verify user creation
   - Check Supabase Dashboard → Table Editor → profiles to verify profile creation

3. Test database:
   - Sign in and add an anime entry
   - Check Supabase Dashboard → Table Editor → anime_entries

4. Test storage:
   - Update your profile avatar
   - Check Supabase Dashboard → Storage → avatars

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Verify your `.env.local` file has the correct values
   - Restart your development server after changing environment variables

2. **"Row Level Security policy violation"**
   - Check that RLS policies are correctly set up
   - Verify the user is authenticated
   - Check policy conditions match your use case

3. **Storage upload fails**
   - Verify bucket exists and is public
   - Check file size is within limits
   - Verify MIME type is allowed
   - Check storage policies are set up correctly

4. **Profile not created on signup**
   - Check the database trigger `on_auth_user_created` exists
   - Verify the trigger function `handle_new_user()` is working
   - Check Supabase logs for errors

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)

