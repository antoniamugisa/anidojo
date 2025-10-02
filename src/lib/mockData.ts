export interface Anime {
  id: string;
  title: string;
  synopsis?: string;
  genres?: string[];
  studio?: string;
  year?: number;
  episodes?: number;
  status?: 'ONGOING' | 'COMPLETED' | 'ANNOUNCED';
  coverArt?: string;
  screenshots?: string[];
  trailers?: string[];
  staff?: {
    director?: string;
    writer?: string;
    voiceActors?: string[];
  };
}

export interface UserActivity {
  id: string;
  user: {
    name: string;
    username: string;
    avatar: string;
  };
  anime: Anime;
  rating: number;
  date: string;
  type: 'watched' | 'liked' | 'reviewed';
}

export const mockAnime: Anime[] = [
  {
    id: "demo-naruto",
    title: "Naruto",
    synopsis: "A young ninja strives to become Hokage.",
    genres: ["Action", "Adventure", "Shounen"],
    studio: "Studio Pierrot",
    year: 2002,
    episodes: 220,
    status: "COMPLETED",
    staff: {
      director: "Hayato Date",
      writer: "Masashi Kishimoto",
      voiceActors: ["Junko Takeuchi", "Noriaki Sugiyama", "Chie Nakamura"]
    }
  },
  {
    id: "demo-attack-on-titan",
    title: "Attack on Titan",
    synopsis: "Humanity fights against man-eating titans.",
    genres: ["Action", "Drama", "Fantasy"],
    studio: "Wit Studio",
    year: 2013,
    episodes: 25,
    status: "COMPLETED",
    staff: {
      director: "Tetsurō Araki",
      writer: "Hajime Isayama",
      voiceActors: ["Yuki Kaji", "Yui Ishikawa", "Marina Inoue"]
    }
  },
  {
    id: "demo-jujutsu-kaisen",
    title: "Jujutsu Kaisen",
    synopsis: "A boy swallows a cursed object and enters sorcery school.",
    genres: ["Action", "Supernatural"],
    studio: "MAPPA",
    year: 2020,
    episodes: 24,
    status: "ONGOING",
    staff: {
      director: "Sunghoo Park",
      writer: "Gege Akutami",
      voiceActors: ["Junya Enoki", "Yuma Uchida", "Yūichi Nakamura"]
    }
  },
  {
    id: "demo-demon-slayer",
    title: "Demon Slayer",
    synopsis: "A young boy becomes a demon slayer to save his sister.",
    genres: ["Action", "Supernatural", "Historical"],
    studio: "Ufotable",
    year: 2019,
    episodes: 26,
    status: "COMPLETED",
    staff: {
      director: "Haruo Sotozaki",
      writer: "Koyoharu Gotouge",
      voiceActors: ["Natsuki Hanae", "Akari Kitō", "Hiro Shimono"]
    }
  },
  {
    id: "demo-one-piece",
    title: "One Piece",
    synopsis: "A pirate's quest to find the ultimate treasure.",
    genres: ["Action", "Adventure", "Comedy"],
    studio: "Toei Animation",
    year: 1999,
    episodes: 1000,
    status: "ONGOING",
    staff: {
      director: "Eiichiro Oda",
      writer: "Eiichiro Oda",
      voiceActors: ["Mayumi Tanaka", "Kazuya Nakai", "Akemi Okamura"]
    }
  },
  {
    id: "demo-spy-family",
    title: "Spy x Family",
    synopsis: "A spy creates a fake family for his mission.",
    genres: ["Action", "Comedy", "Family"],
    studio: "Wit Studio",
    year: 2022,
    episodes: 12,
    status: "ONGOING",
    staff: {
      director: "Kazuhiro Furuhashi",
      writer: "Tatsuya Endo",
      voiceActors: ["Takuya Eguchi", "Atsumi Tanezaki", "Saori Hayami"]
    }
  }
];

export const mockUserActivities: UserActivity[] = [
  {
    id: "activity-1",
    user: {
      name: "Anime Fan",
      username: "animefan",
      avatar: "🎌"
    },
    anime: mockAnime[0],
    rating: 4,
    date: "Sep 24",
    type: "watched"
  },
  {
    id: "activity-2",
    user: {
      name: "Otaku Craig",
      username: "otakucraig",
      avatar: "👺"
    },
    anime: mockAnime[1],
    rating: 5,
    date: "Oct 01",
    type: "watched"
  },
  {
    id: "activity-3",
    user: {
      name: "Manga Reader",
      username: "mangareader",
      avatar: "📚"
    },
    anime: mockAnime[2],
    rating: 4,
    date: "Oct 01",
    type: "watched"
  },
  {
    id: "activity-4",
    user: {
      name: "Studio Watcher",
      username: "studiowatcher",
      avatar: "🎭"
    },
    anime: mockAnime[3],
    rating: 4,
    date: "Oct 01",
    type: "watched"
  },
  {
    id: "activity-5",
    user: {
      name: "Shounen Fan",
      username: "shounenfan",
      avatar: "⚡"
    },
    anime: mockAnime[4],
    rating: 5,
    date: "Sep 30",
    type: "watched"
  },
  {
    id: "activity-6",
    user: {
      name: "Slice of Life",
      username: "sliceoflife",
      avatar: "🌸"
    },
    anime: mockAnime[5],
    rating: 4,
    date: "Oct 01",
    type: "watched"
  }
];

