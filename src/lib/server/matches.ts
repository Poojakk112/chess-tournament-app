import prisma from './prisma';

// Randomly shuffles an array (Fisher-Yates shuffle algorithm)
function shuffleArray<T>(array: T[]): T[] {
	const result = [...array];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

export async function generateRandomMatches(tournamentId: number) {
	// Get all players currently in this tournament
	const tournamentPlayers = await prisma.tournamentPlayer.findMany({
		where: { tournamentId },
		include: { player: true }
	});

	const players = tournamentPlayers.map((tp) => tp.player);

	if (players.length < 2) {
		throw new Error('Need at least 2 players to generate matches');
	}

	// Shuffle the players randomly
	const shuffled = shuffleArray(players);

	// Pair them up two at a time
	const pairs: [(typeof players)[0], (typeof players)[0]][] = [];
	for (let i = 0; i < shuffled.length - 1; i += 2) {
		pairs.push([shuffled[i], shuffled[i + 1]]);
	}

	// If odd number of players, the last one sits out this round (no match created for them)

	// For each pair, randomly pick a winner and save the match
	const createdMatches = [];
	for (const [player1, player2] of pairs) {
		const winner = Math.random() < 0.5 ? player1 : player2;

		const match = await prisma.match.create({
			data: {
				tournamentId,
				player1Id: player1.id,
				player2Id: player2.id,
				winnerId: winner.id
			},
			include: {
				player1: true,
				player2: true,
				winner: true
			}
		});

		createdMatches.push(match);
	}

	return createdMatches;
}