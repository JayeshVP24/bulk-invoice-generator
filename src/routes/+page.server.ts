import { invoiceTempalte } from '$lib';
import type { Actions } from './$types';
import { read, utils } from 'xlsx';
import puppeteer from 'puppeteer';
import PDFMerger from 'pdf-merger-js';

interface form {
	Amount: number;
	RechargeDate: string;
}
export const prerender = false;

function chunkify(array: form[], n: number): form[][] {
	let chunks: form[][] = []
	for(let i = n; i > 0; i--) {
		chunks.push(array.splice(0, Math.ceil(array.length / i)))
	}
	return chunks
}

async function generatePdf(data: form[], index: number) {
	let htmlString: string = '';
	let invoiceNumber = 1;
	let commisionPerc = 0.02;
	let taxPerc = 0.18;
	for (const el of data) {
		htmlString += invoiceTempalte({
			invoiceNo: invoiceNumber.toString(),
			dateOfInvoice: String(el.RechargeDate).split(' ')[0],
			commisionPerc,
			taxPerc,
			tsxAmnt: el.Amount
		});
	}
	try {
		const browser = await puppeteer.launch({
			headless: "new"
		})
		const page = await browser.newPage()
		await page.setContent(htmlString)
		await page.pdf({
			path: `invoice_output/output_${index}.pdf`,
			width: "800px",
			height: "800px",
			timeout: 0,
			printBackground: true,
			displayHeaderFooter: true
		})

		await browser.close()
		console.log("PDF created")
	} catch (e){
		console.log("PDF failed")
		console.log(e)
	}
}

export const actions = {
	default: async ({request}) => {
		const formData = await request.formData();
		const file = formData.get('report') as File;
		const wb = read(new Uint8Array(await file.arrayBuffer()));
		const data = utils.sheet_to_json<form>(wb.Sheets[wb.SheetNames[0]]);

		const merger = new PDFMerger()
		const chunks = chunkify(data, 5)
		for(let i=0; i<chunks.length; i++) {
			generatePdf(chunks[i], i)
			await merger.add(`invoice_output/output_${i}.pdf`)
		}
		const pdf = await merger.saveAsBuffer()
		return {
			pdfBase64: pdf.toString("base64")
		}
	},
} satisfies Actions;
