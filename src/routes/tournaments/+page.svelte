<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
</script>

<div class="max-w-2xl mx-auto p-6">
	<h1 class="text-2xl font-bold mb-4">Tournaments</h1>

	<form method="POST" action="?/create" use:enhance class="mb-6 border rounded p-4 space-y-3">
		<div>
			<label for="name" class="block text-sm font-medium mb-1">Tournament Name</label>
			<input
				id="name"
				name="name"
				type="text"
				required
				class="w-full border rounded px-3 py-2"
				placeholder="e.g. Summer Chess Open 2026"
			/>
		</div>

		{#if form?.error}
			<p class="text-red-600 text-sm">{form.error}</p>
		{/if}

		<button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
			Create Tournament
		</button>
	</form>

	{#if data.tournaments.length === 0}
		<p class="text-gray-500">No tournaments yet.</p>
	{:else}
		<ul class="space-y-4">
			{#each data.tournaments as tournament (tournament.id)}
				<li class="border rounded p-4">
					<div class="flex justify-between items-center mb-3">
						<h2 class="font-semibold text-lg">{tournament.name}</h2>
						<form method="POST" action="?/delete" use:enhance>
							<input type="hidden" name="id" value={tournament.id} />
							<button type="submit" class="text-sm text-red-600 hover:underline">
								Delete Tournament
							</button>
						</form>
					</div>

					{#if tournament.rankings.length > 0}
						<div class="mb-3 bg-blue-50 rounded p-3">
							<p class="text-sm font-semibold text-gray-700 mb-1">🏆 Rankings</p>
							<ol class="text-sm space-y-1">
								{#each tournament.rankings as rank, i (rank.name)}
									<li>
										{#if i === 0}🥇{:else if i === 1}🥈{:else if i === 2}🥉{/if}
										{rank.name} — {rank.wins} win{rank.wins === 1 ? '' : 's'}
									</li>
								{/each}
							</ol>
						</div>
					{/if}

					<p class="text-sm font-medium text-gray-600 mb-1">Players in this tournament:</p>
					{#if tournament.players.length === 0}
						<p class="text-sm text-gray-400 mb-2">No players added yet.</p>
					{:else}
						<ul class="mb-2 space-y-1">
							{#each tournament.players as tp (tp.id)}
								<li class="flex justify-between items-center text-sm bg-gray-50 rounded px-2 py-1">
									<span>{tp.player.name}</span>
									<form method="POST" action="?/removePlayer" use:enhance>
										<input type="hidden" name="id" value={tp.id} />
										<button type="submit" class="text-red-600 hover:underline text-xs">
											Remove
										</button>
									</form>
								</li>
							{/each}
						</ul>
					{/if}

					{#if tournament.players.length >= 2}
						<form method="POST" action="?/generateMatches" use:enhance class="mb-3">
							<input type="hidden" name="tournamentId" value={tournament.id} />
							<button type="submit" class="bg-purple-600 text-white px-3 py-1 rounded text-sm">
								Generate Round (Random Matches)
							</button>
						</form>
					{/if}

					{#if form?.error}
						<p class="text-red-600 text-sm mb-2">{form.error}</p>
					{/if}

					{#if tournament.matches.length > 0}
						<p class="text-sm font-medium text-gray-600 mb-1 mt-3">Match results:</p>
						<ul class="space-y-1 mb-3">
							{#each tournament.matches as match (match.id)}
								<li class="text-sm bg-yellow-50 rounded px-2 py-1">
									{match.player1.name} vs {match.player2.name} —
									<span class="font-medium">Winner: {match.winner?.name}</span>
								</li>
							{/each}
						</ul>
					{/if}

					<form method="POST" action="?/addPlayer" use:enhance class="flex gap-2">
						<input type="hidden" name="tournamentId" value={tournament.id} />
						<select name="playerId" required class="border rounded px-2 py-1 text-sm flex-1">
							<option value="">Select a player...</option>
							{#each data.allPlayers as player (player.id)}
								<option value={player.id}>{player.name}</option>
							{/each}
						</select>
						<button type="submit" class="bg-green-600 text-white px-3 py-1 rounded text-sm">
							Add
						</button>
					</form>
				</li>
			{/each}
		</ul>
	{/if}
</div>