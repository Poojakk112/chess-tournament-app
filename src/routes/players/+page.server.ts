import prisma from '$lib/server/prisma';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export async function load() {
	const players = await prisma.player.findMany({
		orderBy: { createdAt: 'desc' }
	});

	return { players };
}

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData();
		const name = formData.get('name')?.toString().trim();
		const email = formData.get('email')?.toString().trim();

		if (!name) {
			return fail(400, { error: 'Name is required' });
		}

		await prisma.player.create({
			data: {
				name,
				email: email || null
			}
		});

		return { success: true };
	}
};