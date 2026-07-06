import prisma from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export async function load() {
	const tournaments = await prisma.tournament.findMany({
		orderBy: { createdAt: 'desc' },
		include: {
			players: {
				include: { player: true }
			}
		}
	});

	const allPlayers = await prisma.player.findMany({
		orderBy: { name: 'asc' }
	});

	return { tournaments, allPlayers };
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
	}
};