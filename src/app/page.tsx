import { mockUserActivities } from "@/lib/mockData";

export default function Home() {
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center gap-0.5">
        {/* Full stars */}
        {Array(fullStars).fill(0).map((_, i) => (
          <span key={`full-${i}`} className="text-yellow-400 text-sm">★</span>
        ))}
        {/* Half star */}
        {hasHalfStar && <span className="text-yellow-400 text-sm">½</span>}
        {/* Empty stars */}
        {Array(emptyStars).fill(0).map((_, i) => (
          <span key={`empty-${i}`} className="text-gray-400 text-sm">☆</span>
        ))}
      </div>
    );
  };

  const getAnimeColor = (index: number) => {
    const colors = [
      'bg-gradient-to-br from-red-500 to-red-700',
      'bg-gradient-to-br from-green-500 to-green-700',
      'bg-gradient-to-br from-yellow-400 to-yellow-600',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-normal text-gray-700">
            Welcome back, <span className="text-red-600 font-semibold">ant</span>. Here's what your friends have been watching...
          </h1>
        </section>

        {/* Activity Feed */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-medium text-gray-600 uppercase tracking-wider">
              NEW FROM FRIENDS
            </h2>
            <button className="text-sm text-gray-600 hover:text-red-600 flex items-center gap-1 transition-colors">
              ⚡ ALL ACTIVITY
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mockUserActivities.map((activity, index) => (
              <div key={activity.id} className="group">
                {/* Anime Poster */}
                <div className="relative mb-3 overflow-hidden rounded-lg border-2 border-gray-200 shadow-lg aspect-[2/3] hover:shadow-xl transition-shadow">
                  <div className={`w-full h-full ${getAnimeColor(index)} flex items-center justify-center`}>
                    <div className="text-center text-white p-2">
                      <div className="text-2xl mb-1">📺</div>
                      <div className="text-xs font-medium leading-tight">{activity.anime.title}</div>
                    </div>
                  </div>
                  
                  {/* User Avatar - positioned on poster */}
                  <div className="absolute bottom-2 left-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border-2 border-gray-200 shadow-md">
                      <span className="text-sm">{activity.user.avatar}</span>
                    </div>
                  </div>
                </div>
                
                {/* Anime Info */}
                <div className="space-y-1">
                  {/* Stars */}
                  <div className="flex justify-center">
                    {renderStars(activity.rating)}
                  </div>
                  
                  {/* User and Date */}
                  <div className="text-center">
                    <p className="text-xs text-gray-600">
                      <span className="text-red-600 hover:underline cursor-pointer font-medium">
                        {activity.user.name}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
