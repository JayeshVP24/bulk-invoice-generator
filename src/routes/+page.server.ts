import { invoiceTempalte } from '$lib';
import type { Actions } from './$types';
import { read, utils } from 'xlsx';
import puppeteer from 'puppeteer';
import PDFMerger from 'pdf-merger-js';
import fs from "fs"

interface form {
	Amount: number;
	RechargeDate: Date;
	Parent: string
}
export const prerender = false;

function chunkify(array: form[], chunkSize: number): form[][] {
	let chunks: form[][] = []
	for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }

	return chunks
}

async function generatePdf(data: form[], index: number, initialInvoiceNumber: number, commisionPerc: number, central: boolean): Promise<number> {
	let htmlString: string = '';
	let taxPerc = 0.18;
	for (const el of data) {
		const [retailerID, name] = String(el.Parent).split("-")
		htmlString += invoiceTempalte({
			invoiceNo: initialInvoiceNumber.toString(),
			dateOfInvoice: el.RechargeDate.toLocaleDateString(),
			commisionPerc: commisionPerc / 100,
			taxPerc,
			tsxAmnt: el.Amount,
			name,
			retailerID,
			central
		});
		initialInvoiceNumber++
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
	} catch (e){
		console.log("PDF failed")
		console.log(e)
	}
	return initialInvoiceNumber
}

export const actions = {
	default: async ({request}) => {
		console.log("start")
		const formData = await request.formData();
		const file = formData.get('report') as File;
		const wb = read(new Uint8Array(await file.arrayBuffer()), {
			cellDates: true,
			dense: true
		});
		const data = utils.sheet_to_json<form>(wb.Sheets[wb.SheetNames[0]]);

		const merger = new PDFMerger()
		const chunks = chunkify(data, 200)

		if(fs.existsSync("invoice_output")) { 
			fs.rmSync("invoice_output", {
			recursive: true,
			force: true
		})
		}
		fs.mkdirSync("./invoice_output", {
			recursive: true,
		})

		let initialInvoiceNumber = formData.get("initial") as unknown as number
		const commisionPerc = formData.get("commision") as unknown as number
		const central = formData.get("tax") as unknown as string === "0" ? true : false

		for(let i=0; i<chunks.length; i++) {
			initialInvoiceNumber = await generatePdf(chunks[i], i, initialInvoiceNumber, commisionPerc, central)
			await merger.add(`invoice_output/output_${i}.pdf`)
		}
		const pdf = await merger.saveAsBuffer()

		if(fs.existsSync("invoice_output")) fs.rmSync("invoice_output", {
			recursive: true,
			force: true
		})	

		console.log("end")
		return {
			pdfBase64: pdf.toString("base64")
		}
	},
} satisfies Actions;
