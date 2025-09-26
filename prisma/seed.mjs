// Minimal Prisma seed for sample anime and episodes
import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function main() {
	// Sample anime entries
	const animeList = [
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
			staff: null,
			episodesRel: [
				{ episodeNumber: 1, title: "Enter: Naruto Uzumaki!" },
				{ episodeNumber: 2, title: "My Name is Konohamaru!" },
			],
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
			staff: null,
			episodesRel: [
				{ episodeNumber: 1, title: "To You, in 2000 Years" },
				{ episodeNumber: 2, title: "That Day" },
			],
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
			staff: null,
			episodesRel: [
				{ episodeNumber: 1, title: "Ryomen Sukuna" },
				{ episodeNumber: 2, title: "For Myself" },
			],
		},
	];

	for (const anime of animeList) {
		// Upsert anime
		const upserted = await prisma.anime.upsert({
			where: { id: anime.id },
			update: {
				title: anime.title,
				synopsis: anime.synopsis,
				genres: anime.genres,
				studio: anime.studio,
				year: anime.year,
				episodes: anime.episodes,
				status: anime.status,
				coverArt: anime.coverArt,
				screenshots: anime.screenshots,
				trailers: anime.trailers,
				staff: anime.staff,
			},
			create: {
				id: anime.id,
				title: anime.title,
				synopsis: anime.synopsis,
				genres: anime.genres,
				studio: anime.studio,
				year: anime.year,
				episodes: anime.episodes,
				status: anime.status,
				coverArt: anime.coverArt,
				screenshots: anime.screenshots,
				trailers: anime.trailers,
				staff: anime.staff,
			},
		});

		// Seed episodes for this anime (idempotent)
		for (const ep of anime.episodesRel) {
			await prisma.episode.upsert({
				where: {
					// Composite unique on animeId, season, episodeNumber
					animeId_season_episodeNumber: {
						animeId: upserted.id,
						season: 1,
						episodeNumber: ep.episodeNumber,
					},
				},
				update: {
					title: ep.title ?? null,
				},
				create: {
					animeId: upserted.id,
					season: 1,
					episodeNumber: ep.episodeNumber,
					title: ep.title ?? null,
				},
			});
		}
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});



