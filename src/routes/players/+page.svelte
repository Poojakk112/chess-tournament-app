<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
</script>

<div class="max-w-2xl mx-auto p-6">
	<h1 class="text-2xl font-bold mb-4">Players</h1>

	<form method="POST" action="?/create" use:enhance class="mb-6 border rounded p-4 space-y-3">
		<div>
			<label for="name" class="block text-sm font-medium mb-1">Name</label>
			<input
				id="name"
				name="name"
				type="text"
				required
				class="w-full border rounded px-3 py-2"
				placeholder="Player name"
			/>
		</div>

		<div>
			<label for="email" class="block text-sm font-medium mb-1">Email (optional)</label>
			<input
				id="email"
				name="email"
				type="email"
				class="w-full border rounded px-3 py-2"
				placeholder="player@example.com"
			/>
		</div>

		{#if form?.error}
			<p class="text-red-600 text-sm">{form.error}</p>
		{/if}

		<button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
			Add Player
		</button>
	</form>

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