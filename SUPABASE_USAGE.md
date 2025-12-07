# Supabase Usage Examples

This document provides examples of how to use Supabase in your AniDojo application.

## Environment Variables

Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Authentication

### Using AuthContext (Client Components)

```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function MyComponent() {
  const { user, isAuthenticated, signIn, signUp, signOut, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    return (
      <div>
        <button onClick={() => signIn('user@example.com', 'password')}>
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div>
      <p>Welcome, {user?.username}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Using Server Client (Server Components)

```tsx
import { createClient } from '@/lib/supabase/server';

export default async function ServerComponent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div>Not authenticated</div>;
  }

  return <div>Hello, {user.email}</div>;
}
```

## Database Queries

### Using Query Functions

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAnimeEntries, upsertAnimeEntry } from '@/lib/supabase/queries';

export default function AnimeList() {
  const { user } = useAuth();
  const [animeEntries, setAnimeEntries] = useState([]);

  useEffect(() => {
    if (user) {
      loadAnimeEntries();
    }
  }, [user]);

  const loadAnimeEntries = async () => {
    try {
      const entries = await getAnimeEntries(user.id);
      setAnimeEntries(entries);
    } catch (error) {
      console.error('Error loading anime entries:', error);
    }
  };

  const addAnime = async () => {
    try {
      await upsertAnimeEntry({
        user_id: user.id,
        anime_id: 1,
        title: 'Attack on Titan',
        status: 'watching',
        episodes_watched: 0,
      });
      loadAnimeEntries();
    } catch (error) {
      console.error('Error adding anime:', error);
    }
  };

  return (
    <div>
      <button onClick={addAnime}>Add Anime</button>
      {animeEntries.map(entry => (
        <div key={entry.id}>{entry.title}</div>
      ))}
    </div>
  );
}
```

### Direct Supabase Queries

```tsx
'use client';

import { createClient } from '@/lib/supabase/client';

export default function CustomQuery() {
  const supabase = createClient();

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('anime_entries')
      .select('*')
      .eq('status', 'watching')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log('Data:', data);
  };

  return <button onClick={fetchData}>Fetch Data</button>;
}
```

## Storage

### Upload Avatar

```tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { uploadAvatar, deleteAvatar } from '@/lib/supabase/storage';
import { createClient } from '@/lib/supabase/client';

export default function AvatarUpload() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || null);
  const supabase = createClient();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      
      // Delete old avatar if exists
      if (avatarUrl) {
        await deleteAvatar(user.id, avatarUrl);
      }

      // Upload new avatar
      const url = await uploadAvatar(user.id, file);
      setAvatarUrl(url);

      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: url })
        .eq('id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Error uploading avatar');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {avatarUrl && (
        <img 
          src={avatarUrl} 
          alt="Avatar" 
          className="w-32 h-32 rounded-full"
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
    </div>
  );
}
```

### Upload Review Image

```tsx
'use client';

import { useState } from 'react';
import { uploadFile, getPublicUrl, STORAGE_BUCKETS } from '@/lib/supabase/storage';

export default function ReviewImageUpload() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `reviews/${fileName}`;

    try {
      await uploadFile(STORAGE_BUCKETS.REVIEW_IMAGES, filePath, file);
      const url = getPublicUrl(STORAGE_BUCKETS.REVIEW_IMAGES, filePath);
      setImageUrl(url);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {imageUrl && <img src={imageUrl} alt="Review" />}
    </div>
  );
}
```

### Delete File

```tsx
import { deleteFile, STORAGE_BUCKETS } from '@/lib/supabase/storage';

async function removeFile() {
  try {
    await deleteFile(STORAGE_BUCKETS.AVATARS, 'user-id/avatar.jpg');
    console.log('File deleted');
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}
```

## Server Actions (Next.js 14+)

### Server Action Example

```tsx
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateAnimeStatus(
  animeId: number,
  status: string
) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  const { error } = await supabase
    .from('anime_entries')
    .update({ status })
    .eq('user_id', user.id)
    .eq('anime_id', animeId);

  if (error) {
    throw error;
  }

  revalidatePath('/dashboard');
}
```

## API Routes

### Protected API Route

```tsx
// app/api/anime/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('anime_entries')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
```

## Error Handling

Always wrap Supabase operations in try-catch blocks:

```tsx
try {
  const { data, error } = await supabase
    .from('anime_entries')
    .select('*');

  if (error) {
    // Handle Supabase error
    console.error('Supabase error:', error.message);
    return;
  }

  // Use data
  console.log(data);
} catch (error) {
  // Handle unexpected errors
  console.error('Unexpected error:', error);
}
```

## Type Safety

Use the types from `@/types/database`:

```tsx
import type { AnimeEntry, Review, Profile } from '@/types/database';

const entry: AnimeEntry = {
  id: 'uuid',
  user_id: 'user-uuid',
  anime_id: 1,
  title: 'Attack on Titan',
  status: 'watching',
  // ... other fields
};
```

## Best Practices

1. **Always check authentication** before database operations
2. **Use RLS policies** for security (already set up in migrations)
3. **Handle errors gracefully** with user-friendly messages
4. **Use server components** when possible for better performance
5. **Revalidate paths** after mutations in server actions
6. **Validate file types and sizes** before uploading to storage
7. **Use TypeScript types** for type safety

