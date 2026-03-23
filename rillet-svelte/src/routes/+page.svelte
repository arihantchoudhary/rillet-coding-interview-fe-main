<script lang="ts">
	let formData = $state({
		invoiceCode: ''
	});

	function handleSubmit(e: Event) {
		e.preventDefault();
	}
</script>

<div class="flex min-h-screen items-center justify-center">
	<form onsubmit={handleSubmit} class="w-full max-w-md space-y-4 p-6">
		<h1 class="text-4xl font-bold">Welcome to Rillet!</h1>

		<div>
			<label for="invoiceCode" class="block text-sm font-medium">Invoice Code</label>
			<input
				type="text"
				id="invoiceCode"
				name="invoiceCode"
				data-testid="invoiceCode"
				bind:value={formData.invoiceCode}
				class="mt-1 w-full rounded border p-2"
			/>
		</div>

		<button type="submit" class="w-full rounded bg-purple-700 p-2 text-white hover:bg-purple-600">
			Submit
		</button>
	</form>
</div>
