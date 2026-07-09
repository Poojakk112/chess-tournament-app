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
	},

	update: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));
		const name = formData.get('name')?.toString().trim();
		const email = formData.get('email')?.toString().trim();

		if (!name) {
			return fail(400, { error: 'Name is required' });
		}

		await prisma.player.update({
			where: { id },
			data: {
				name,
				email: email || null
			}
		});

		return { success: true };
	},

	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = Number(formData.get('id'));

		try {
			await prisma.player.delete({
				where: { id }
			});
		} catch (err) {
			return fail(400, {
				error: 'Cannot delete this player - they are part of a tournament. Remove them from the tournament first.'
			});
		}

		return { success: true };
	}
};