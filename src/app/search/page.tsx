import AnimeSearch from '@/components/AnimeSearch';

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 uppercase tracking-wide">Search Anime</h1>
          <p className="text-lg text-gray-600">Find your favorite anime from MyAnimeList database</p>
        </div>
        <AnimeSearch />
      </div>
    </div>
  );
}
