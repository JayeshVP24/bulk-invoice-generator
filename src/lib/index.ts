// place files you want to import through the `$lib` alias in this folder.
import { numWords } from "./numWords.js"

export const invoiceTempalte = (data: {
	invoiceNo: string,
	dateOfInvoice: string,
	tsxAmnt: number,
	commisionPerc: number,
	taxPerc: number,
}) => {
  const taxableVal = data.tsxAmnt * data.commisionPerc
  const gst = taxableVal * data.taxPerc
  const totalAmt = taxableVal + gst
  const totalAmtInWords = numWords(totalAmt.toFixed(0))
	return (
	`
<html id="inc">

<body>
<div class="wrapper">
  <h1>GIFTING TREASURES UTILITY SERVICES PRIVATE LIMITED</h1>
  <div id="info">
    <p>CIN:U93000MH2021PTC373000</p>
    <p>71 PARK STREET GROUND FLOOR ROOM NO-45(PARK PLAZA) KOLKATA-700016</p>
    <p>E-Mail: infogiftingtreasuresutility@gmail.com Mob:+91 8779256836</p>
    <p>GST Number: 19AAJCG4554F1ZF</p>
  </div>
  <h2>Tax Invoice</h2>
  <div id="detail">
    <span>Invoice No</span>
    <span>${data.invoiceNo}</span>
    <span>Date of Invoice</span>
    <span>${data.dateOfInvoice}</span>
  </div>
  <h2>Billed To</h2>
  <div id="billed">
    <span>
      <p>Name</p>
      <p>ABHISHEK WADEKAR</p>
    </span>
    <span>
      <p>Retailer ID</p>
      <p>8779254908</p>
    </span>
    <span>
      <p>Address:</p>
      <p>Mumbai</p>
    </span>
    <span>
      <p>GSTN:</p>
      <p>NA</p>
    </span>
    <span>
      <p>PAN NO:</p>
      <p>NA</p>
    </span>
    <span>
      <p>Place of Supply</p>
      <p>Maharashtra</p>
    </span>
  </div>
  <div id="tsx">
    <div>
      <span>Transactions Processed for the Month </span>
      <span>HSN/SAC</span>
      <span>Transaction Amount (INR)</span>
      <span>Taxable Value</span>
      <span>IGST ${data.taxPerc * 100} %</span>
      <span>Total Invoice Value</span>
    </div>
    <div>
      <span>Platform charges CREDIT CARD – Feb -
        2023</span>
      <span>998313</span>
      <span>${data.tsxAmnt}</span>
      <span>${taxableVal.toFixed(2)}</span>
      <span>${gst.toFixed(2)}</span>
      <span>${totalAmt.toFixed(2)}</span>
    </div>
    <div>
      <span>Total</span>
      <span>${totalAmt.toFixed(2)}</span>
    </div>
  </div>

  <div id="final">
    <div>
      <span>Invoice Amount In Words(INR): ${totalAmtInWords} Rupees</span>
      <span>
        <p>Company's PAN: AAJCG4554F</p>
        <p>Bank Account Details:</p>
        <p>Name : GIFTING TREASURES UTILITY SERVICES PRIVATE LIMITED</p>
        <p>Name of Bank : HDFC Bank</p>
        <p>Account Number : 50200075994120</p>
        <p>IFSC Code : HDFC0007674</p>
      </span>
    </div>
    <div>
      <span>For, GIFTING TREASURES UTILITY SERVICES PRIVATE LIMITED</span>
      <span>This is computer generated invoice no signature required</span>
    </div>
  </div>
</div>
</body>
<style>
  html {
    width: 800px;
    margin: 0 auto;
    max-height: 900px;
    font-family: sans-serif;
    padding: 0;
    color: #05316e;
    font-size: 0.8rem;
    font-weight: 700;
  }

  body {
    padding: 0;
    margin: 0;
  }

  .wrapper {
    height: 800px;
    overflow: hidden;
  }

  h1 {
    background: #2d88b3;
    color: white;
    font-size: 1.4rem;
    border: 2px solid black;
    text-align: center;
    padding: 5px 0;
    margin: 0;
  }

  #info {
    font-weight: 700;
    text-align: center;
    border: 2px solid black;
    margin: 10px 0;
  }

  #info p {
    margin: 10px 0;
  }

  h2 {
    border: 2px solid black;
    text-align: center;
    font-size: inherit;
    padding: 4px 0;
    margin: 0;
  }

  #detail {
    display: flex;
    width: 100%;
    margin: 12px 0;
  }

  #detail span {
    text-align: center;
    border: 2px solid black;
    border-right: 0;
    padding: 5px 0;
  }

  #detail span:last-child {
    border-right: 2px solid black;
  }

  #detail span:nth-child(1) {
    width: 20%;
  }

  #detail span:nth-child(2) {
    width: 30%;
  }

  #detail span:nth-child(3) {
    width: 20%;
  }

  #detail span:nth-child(4) {
    width: 30%;
  }

  #billed span {
    display: flex;
    width: 100%;
    font-weight: inherit;
  }

  #billed {
    margin: 10px 0;
  }

  #billed span p {
    border: 2px solid black;
    border-bottom: 0;
    padding: 3px 5px;
    margin: 0;
  }

  #billed span:last-child {
    border-bottom: 2px solid black;
  }

  #billed span p:first-child {
    width: 30%;
  }

  #billed span p:last-child {
    width: 70%;
    border-left: 0;
  }

  #tsx div {
    display: flex;
  }

  #tsx div:first-child {
    background: #2d88b3;
    color: white;
  }

  #tsx div:last-child {
    background: #2d88b3;
    color: white;
  }

  #tsx div span {
    border: 2px solid black;
    border-right: 0;
    border-bottom: 0;
    padding: 10px 0;
    text-align: center;
  }

  #tsx div span:last-child {
    border-right: 2px solid black;
  }

  #tsx div span:nth-child(1) {
    width: 30%;
  }

  #tsx div span:nth-child(2) {
    width: 10%;
  }

  #tsx div span:nth-child(3) {
    width: 20%;
  }

  #tsx div span:nth-child(4) {
    width: 10%;
  }

  #tsx div span:nth-child(5) {
    width: 10%;
  }

  #tsx div span:nth-child(6) {
    width: 20%;
  }

  #tsx div:last-child span:nth-child(1) {
    width: 29.6%;
    border-bottom: 2px solid black;
  }

  #tsx div:last-child span:nth-child(2) {
    width: 70%;
    border-bottom: 2px solid black;
  }

  #final {
    display: flex;
    border: 2px solid black;
    margin: 10px 0;
  }

  #final div:first-child {
    width: 60%;
    border-right: 2px solid black;
  }

  #final div:last-child {
    width: 40%;
  }

  #final div span {
    border-bottom: 2px solid black;
    padding: 10px 5px;
    display: block;
  }

  #final div span:last-child {
    border-bottom: 0;
  }

  #final div span p {
    padding: 5px 5px;
    margin: 0;
  }
</style>

</html>
	`
	)
}



