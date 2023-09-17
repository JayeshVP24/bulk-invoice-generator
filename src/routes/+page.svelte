<script lang="ts">
	import type { ActionData } from './$types';
	import { enhance } from '$app/forms';

	export let form: ActionData;
	console.log(form?.pdfBase64.slice(0, 50));
	let aTag: HTMLAnchorElement | null = null;

	$: if (form) {
		if (aTag) {
			console.log(aTag?.id);
			const source = `data:application/pdf;base64,${form.pdfBase64}`;
			aTag.href = source;
			aTag.download = 'invoice.pdf'; // Specify the desired PDF file name
			aTag.style.display = 'none'; // Hide the link

			// Trigger the click event
			aTag.click();
		}
	}
</script>

<h1 class="text-4xl">Invoice Generator Gifting</h1>

<form method="POST" enctype="multipart/form-data" use:enhance>
	<input required type="file" accept=".xls, .xlsx" name="report" />

	<button type="submit">Submit</button>
</form>

<a bind:this={aTag} id="down">download</a>

<style>
	a {
		display: none;
	}
</style>
