import prisma from '$lib/server/prisma';

export async function load() {
	const players = await prisma.player.findMany({
		orderBy: { createdAt: 'desc' }
	});

	return { players };
}