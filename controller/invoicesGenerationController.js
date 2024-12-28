//import puppeteer from "puppeteer";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { promises as fs } from "fs";
import path from "path";
import nodemailer from "nodemailer";
import numWords from "num-words";
import Invoice from "../models/invoiceModel.js";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.resolve();

export const generateInvoice = async (req, res) => {
  const { invoiceId } = req.params;
  let browser = null;

  try {
    const { to, cc, message } = req.body;

    const invoiceDetails = await Invoice.findById(invoiceId).exec();
    if (!invoiceDetails) {
      return res.status(404).send("Invoice not found");
    }

    const {
      fbo_name,
      contact_person,
      phone,
      address: { line1, line2 },
      outlets,
      invoice_number,
      invoice_date,
      proposal_number,
      pincode,
      place_of_supply,
      field_executive_name,
      team_leader_name,
      gst_number,
      same_state,
    } = invoiceDetails;

    // Calculate subtotal, taxes, and total
    let subTotal = 0;
    const outletItems = outlets
      .map((outlet) => {
        const unit_cost = parseFloat(outlet.unit_cost || 0);
        const amount = parseFloat(outlet.amount || 0);
        subTotal += amount;

        return `
          <tr>
            <td class="px-2 py-1 text-center">${outlet.outlet_name || ""}</td>
            <td class="px-2 py-1 text-center">${outlet.description || ""}</td>
            <td class="px-2 py-1 text-center">${outlet.service || ""}</td>
            <td class="px-2 py-1 text-center">${outlet.man_days || 0}</td>
            <td class="px-2 py-1 text-center">${outlet.quantity || 0}</td>
            <td class="px-2 py-1 text-center">₹${unit_cost.toFixed(2)}</td>
            <td class="px-2 py-1 text-center">₹${amount.toFixed(2)}</td>
          </tr>
        `;
      })
      .join("");

    // Initialize tax variables
    let cgst = 0, sgst = 0, gst = 0, overallTotal = 0;

    if (same_state) {
      cgst = parseFloat((subTotal * 0.09).toFixed(2));
      sgst = parseFloat((subTotal * 0.09).toFixed(2));
      overallTotal = parseFloat((subTotal + cgst + sgst).toFixed(2));
    } else {
      gst = parseFloat((subTotal * 0.18).toFixed(2));
      overallTotal = parseFloat((subTotal + gst).toFixed(2));
    }

    let tax = same_state
      ? `<p><span class="font-semibold">Add: CGST (9%):</span> ₹${cgst.toFixed(2)}</p>
         <p><span class="font-semibold">Add: SGST (9%):</span> ₹${sgst.toFixed(2)}</p>`
      : `<p><span class="font-semibold">Add: IGST:</span> ₹${gst.toFixed(2)}</p>`;

    const totalInWords = numWords(Math.floor(overallTotal));

    const htmlTemplate = await fs.readFile(
      path.join(__dirname, "templates", "invoice.html"),
      "utf-8"
    );

    const imagePath = path.join(__dirname, "templates", "logo2.png");
    const imageData = await fs.readFile(imagePath, { encoding: "base64" });

    const dynamicContent = htmlTemplate
      .replace(/{{imageData}}/g, imageData)
      .replace(/{{fbo_name}}/g, fbo_name)
      .replace(/{{contact_person}}/g, contact_person)
      .replace(/{{contact_number}}/g, phone)
      .replace(/{{address}}/g, `${line1}, ${line2 || ""}`)
      .replace(/{{invoice_number}}/g, invoice_number)
      .replace(/{{invoice_date}}/g, new Date(invoice_date).toLocaleDateString())
      .replace(/{{outletItems}}/g, outletItems)
      .replace(/{{sub_total}}/g, `₹${subTotal.toFixed(2)}`)
      .replace(/{{overallTotal}}/g, `₹${overallTotal.toFixed(2)}`)
      .replace(/{{totalInWords}}/g, `${totalInWords} rupees`)
      .replace(/{{field_executive_name}}/g, field_executive_name)
      .replace(/{{team_leader_name}}/g, team_leader_name)
      .replace(/{{proposal_number}}/g, proposal_number)
      .replace(/{{place_of_supply}}/g, place_of_supply)
      .replace(/{{pincode}}/g, pincode)
      .replace(/{{gst_number}}/g, gst_number)
      .replace(/{{tax}}/g, tax);

    //browser = await puppeteer.launch();

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    
    const page = await browser.newPage();
    

    const baseUrl = `file://${__dirname}/templates/`;
    await page.setContent(dynamicContent, {
      waitUntil: "networkidle0",
      baseUrl,
    });

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `<${process.env.EMAIL_USERNAME}>`,
      to,
      cc,
      subject: "Invoice Document",
      html: message,
      attachments: [
        {
          filename: `invoice-${invoice_number}.pdf`,
          content: pdfBuffer,
          encoding: "base64",
        },
      ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

    await Invoice.findByIdAndUpdate(invoiceId, { status: "Unpaid" });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error generating PDF or sending email:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
