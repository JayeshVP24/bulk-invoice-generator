import { invoiceTempalte } from '$lib';
import type { Actions } from './$types';
import { read, utils } from 'xlsx';
import chromium from 'chrome-aws-lambda';
import PDFMerger from 'pdf-merger-js';

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

async function generatePdf(data: form[], initialInvoiceNumber: number, commisionPerc: number, central: boolean): Promise<[number, Buffer] | undefined>  {
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

		const browser = await chromium.puppeteer.launch({
			args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
			defaultViewport: chromium.defaultViewport,
			executablePath: await chromium.executablePath,
			headless: "new",
			ignoreHTTPSErrors: true,
		})

		const page = await browser.newPage()
		await page.setContent(htmlString)
		const pdfBuffer = (await page.pdf({
			width: "800px",
			height: "800px",
			timeout: 0,
			printBackground: true,
			displayHeaderFooter: true
		}))

		await browser.close()
		return [initialInvoiceNumber, pdfBuffer]
	} catch (e){
		console.log("PDF failed")
		console.log(e)
	}
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

		let initialInvoiceNumber = formData.get("initial") as unknown as number
		const commisionPerc = formData.get("commision") as unknown as number
		const central = formData.get("tax") as unknown as string === "0" ? true : false

		for(let i=0; i<chunks.length; i++) {
			let resPdf = await generatePdf(chunks[i], initialInvoiceNumber, commisionPerc, central)
			if(!resPdf) throw Error("Something went wront")
			initialInvoiceNumber = resPdf[0]
			await merger.add(resPdf[1])
		}
		const pdf = await merger.saveAsBuffer()

		console.log("end")
		return {
			pdfBase64: pdf.toString("base64")
		}
	},
} satisfies Actions;

