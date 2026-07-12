import prisma from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';
import { generateRandomMatches } from '$lib/server/matches';
import type { Actions } from './$types';

export async function load() {
	const tournaments = await prisma.tournament.findMany({
		orderBy: { createdAt: 'desc' },
		include: {
			players: {
				include: { player: true }
			},
			matches: {
				include: { player1: true, player2: true, winner: true },
				orderBy: { playedAt: 'desc' }
			}
		}
	});

	const allPlayers = await prisma.player.findMany({
		orderBy: { name: 'asc' }
	});

	const tournamentsWithRankings = tournaments.map((tournament) => {
		const winCounts = new Map<number, { name: string; wins: number }>();
		for (const tp of tournament.players) {
			winCounts.set(tp.player.id, { name: tp.player.name, wins: 0 });
		}

		for (const match of tournament.matches) {
			if (match.winnerId && winCounts.has(match.winnerId)) {
				winCounts.get(match.winnerId)!.wins += 1;
			}
		}

		const rankings = Array.from(winCounts.values())
			.sort((a, b) => b.wins - a.wins)
			.slice(0, 3);

		return { ...tournament, rankings };
	});

	return { tournaments: tournamentsWithRankings, allPlayers };
}

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim();

		if (!name) {
			return fail(400, { error: 'Tournament name is required' });
		}

		await prisma.tournament.create({
			data: { name }
		});

		return { success: true };
	},

	update: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const name = formData.get('name')?.toString().trim();

		if (!name) {
			return fail(400, { error: 'Tournament name is required' });
		}

		await prisma.tournament.update({
			where: { id },
			data: { name }
		});

		return { success: true };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));

		await prisma.tournament.delete({
			where: { id }
		});

		return { success: true };
	},

	addPlayer: async ({ request }) => {
		const formData = await request.formData();
		const tournamentId = Number(formData.get('tournamentId'));
		const playerId = Number(formData.get('playerId'));

		if (!playerId) {
			return fail(400, { error: 'Please select a player' });
		}

		await prisma.tournamentPlayer.create({
			data: { tournamentId, playerId }
		});

		return { success: true };
	},

	removePlayer: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));

		await prisma.tournamentPlayer.delete({
			where: { id }
		});

		return { success: true };
	},

	generateMatches: async ({ request }) => {
		const formData = await request.formData();
		const tournamentId = Number(formData.get('tournamentId'));

		try {
			await generateRandomMatches(tournamentId);
			return { success: true };
		} catch (err) {
			return fail(400, { error: (err as Error).message });
		}
	}
};