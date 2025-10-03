# 🎌 Anime Data Integration Guide

Your AniDojo site now has real anime data integration! Here's how it works:

## 🚀 What's Included

### 1. **Jikan API Integration** (MyAnimeList)
- **Free** - No API key required
- **Comprehensive** - 50,000+ anime database
- **Real-time** - Live data from MyAnimeList

### 2. **New Pages & Features**
- **`/search`** - Search for any anime
- **`/browse`** - Browse top-rated anime
- **Real anime covers** - Actual poster images
- **Pagination** - Browse through multiple pages
- **Loading states** - Smooth user experience

## 📁 Files Added

```
src/
├── lib/
│   └── animeApi.ts          # API functions and types
├── hooks/
│   └── useAnime.ts          # React hooks for data fetching
├── components/
│   └── AnimeSearch.tsx      # Search component
└── app/
    └── search/
        └── page.tsx         # Search page
```

## 🎯 How to Use

### 1. **Search Anime**
Visit `/search` and type any anime name:
- "Attack on Titan"
- "Naruto"
- "Demon Slayer"
- "One Piece"

### 2. **Browse Top Anime**
Visit `/browse` to see the highest-rated anime from MyAnimeList.

### 3. **Add to Your Pages**
Use the hooks in any component:

```tsx
import { useAnimeSearch, useTopAnime } from '@/hooks/useAnime';

function MyComponent() {
  const { data: anime, loading, error } = useAnimeSearch("Naruto");
  const { data: topAnime } = useTopAnime(1);
  
  return (
    <div>
      {loading && <div>Loading...</div>}
      {anime.map(anime => (
        <div key={anime.id}>{anime.title}</div>
      ))}
    </div>
  );
}
```

## 🔧 API Functions Available

### Search Functions
```tsx
import { searchAnime, getTopAnime, getSeasonalAnime } from '@/lib/animeApi';

// Search for anime
const results = await searchAnime("Naruto", 1, 20);

// Get top anime
const topAnime = await getTopAnime(1, 20);

// Get seasonal anime
const seasonal = await getSeasonalAnime(2024, "winter");
```

### Data Structure
Each anime includes:
- `title` - English title
- `year` - Release year
- `episodes` - Number of episodes
- `genres` - Array of genres
- `coverArt` - Poster image URL
- `synopsis` - Plot description
- `studio` - Animation studio
- `status` - ONGOING/COMPLETED/ANNOUNCED

## 🎨 Styling

The anime data integrates seamlessly with your existing AniDojo design:
- **Red/Green/Yellow** color scheme maintained
- **Gradient backgrounds** for anime cards
- **Real poster images** when available
- **Fallback TV emoji** for missing images

## 🚀 Next Steps

### 1. **Add More Features**
- User favorites/watchlist
- Anime details pages
- User reviews and ratings
- Recommendations

### 2. **Alternative APIs**
If you want different data sources:
- **AniList API** - GraphQL, more detailed
- **Kitsu API** - Good for user data
- **AnimeNewsNetwork** - News and reviews

### 3. **Caching**
For better performance, consider adding:
- React Query for caching
- Local storage for user preferences
- Image optimization

## 🐛 Troubleshooting

### Common Issues:
1. **CORS errors** - The Jikan API should work from browsers
2. **Rate limiting** - Jikan has a 3 requests/second limit
3. **Missing images** - Some anime may not have cover art

### Error Handling:
The components include error states and loading indicators to handle API issues gracefully.

---

**Ready to explore anime data!** 🎌 Visit `/search` or `/browse` to see it in action.
