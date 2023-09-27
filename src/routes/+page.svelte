<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';

	export let form: ActionData;
	console.log(form?.pdfBase64.slice(0, 50));
	let aTag: HTMLAnchorElement | null = null;

	let formLoading = false;

	$: if (form) {
		if (aTag) {
			const source = `data:application/pdf;base64,${form.pdfBase64}`;
			console.log('heoooo');
			aTag.href = source;
			aTag.download = `invoice.pdf`; // Specify the desired PDF file name
			aTag.style.display = 'none'; // Hide the link

			// Trigger the click event
			aTag.click();
		}
	}
</script>

<div class="bg-white rounded-lg shadow-lg p-8 w-96">
	<h1 class="text-4xl mb-6 text-center font-semibold">Invoice Generator Gifting</h1>

	<form
		method="POST"
		enctype="multipart/form-data"
		use:enhance={() => {
			formLoading = true;
			return async ({ update, result }) => {
				formLoading = false;
				update();
			};
		}}
	>
		<div class="mb-4">
			<label for="report" class="text-lg font-semibold">Upload Excel</label>
			<input
				required
				type="file"
				accept=".xls, .xlsx"
				name="report"
				id="report"
				class="border rounded-lg py-2 px-3 w-full"
			/>
		</div>

		<div class="mb-4">
			<label for="initial" class="text-lg font-semibold">Initial Invoice Number</label>
			<input
				required
				type="number"
				id="initial"
				name="initial"
				class="border rounded-lg py-2 px-3 w-full"
			/>
		</div>

		<div class="mb-4">
			<label for="commision" class="text-lg font-semibold">Commission Percentage (in %)</label>
			<input
				required
				type="number"
				id="commision"
				name="commision"
				class="border rounded-lg py-2 px-3 w-full"
			/>
		</div>

		<div class="mb-4">
			<label for="tax" class="text-lg font-semibold">Tax Bracket</label>
			<select name="tax" id="tax" class="border rounded-lg py-2 px-3 w-full">
				<option value="0">IGST</option>
				<option value="1">SGST & CGST</option>
			</select>
		</div>

		<button
			type="submit"
			class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg w-full
				disabled:opacity-40 disabled:cursor-not-allowed"
			disabled={formLoading}>Submit</button
		>
		{#if formLoading}
			<p class="text-sm text-red-600 py-2 pt-4 mx-auto block w-fit">
				Please Wait, this may take a while
			</p>
		{/if}
	</form>
	<a bind:this={aTag} class="hidden" id="aTag" href="/">Download</a>
</div>
