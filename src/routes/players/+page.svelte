<script lang="ts">
	let { data } = $props();
</script>

<div class="max-w-2xl mx-auto p-6">
	<h1 class="text-2xl font-bold mb-4">Players</h1>

	{#if data.players.length === 0}
		<p class="text-gray-500">No players yet.</p>
	{:else}
		<ul class="space-y-2">
			{#each data.players as player}
				<li class="border rounded p-3 flex justify-between items-center">
					<div>
						<p class="font-medium">{player.name}</p>
						{#if player.email}
							<p class="text-sm text-gray-500">{player.email}</p>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>