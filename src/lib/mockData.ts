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
    coverArt: null,
    screenshots: null,
    trailers: null,
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
    coverArt: null,
    screenshots: null,
    trailers: null,
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
    coverArt: null,
    screenshots: null,
    trailers: null,
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
    coverArt: null,
    screenshots: null,
    trailers: null,
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
    coverArt: null,
    screenshots: null,
    trailers: null,
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
    coverArt: null,
    screenshots: null,
    trailers: null,
    staff: {
      director: "Kazuhiro Furuhashi",
      writer: "Tatsuya Endo",
      voiceActors: ["Takuya Eguchi", "Atsumi Tanezaki", "Saori Hayami"]
    }
  }
];

