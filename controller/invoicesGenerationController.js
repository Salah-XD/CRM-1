import puppeteer from "puppeteer";
import { promises as fs } from "fs";
import path from "path";
import nodemailer from "nodemailer";
import numWords from "num-words"; // Import num-words library
import Invoice from "../models/invoiceModel.js"; // Import your Invoice model
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const __dirname = path.resolve();

export const generateInvoice = async (req, res) => {
  const { invoiceId } = req.params;
  try {
    const { to, message } = req.body; // Email details

    // Fetch invoice details based on invoiceId
    const invoiceDetails = await Invoice.findById(invoiceId).exec();

    if (!invoiceDetails) {
      return res.status(404).send("Invoice not found");
    }

    // Extract data from MongoDB format
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
    } = invoiceDetails;

    // Convert MongoDB date format
    const invoiceDate = invoice_date ? new Date(invoice_date) : new Date();

    // Calculate total, cgst, sgst, and overall total
    let total = 0;
    let subTotal = 0;
    const outletItems = outlets
      .map((outlet) => {
        const man_days = outlet.man_days || 0;
        const unit_cost = parseFloat(outlet.unit_cost || 0);
        const discount = parseFloat(outlet.discount || 0);
        const amount = parseFloat(outlet.amount || 0);

        subTotal += amount;

        return `
      <tr>
        <td class="px-2 py-1 text-center">${outlet.outlet_name || ""}</td>
        <td class="px-2 py-1 text-center">${
          outlet.no_of_food_handlers || ""
        }</td>
        <td class="px-2 py-1 text-center">${man_days}</td>
        <td class="px-2 py-1 text-center">₹${unit_cost.toFixed(2)}</td>
        <td class="px-2 py-1 text-center">₹${discount.toFixed(2)}</td>
        <td class="px-2 py-1 text-center">₹${amount.toFixed(2)}</td>
      </tr>
    `;
      })
      .join("");

    const cgst = subTotal * 0.09; // 9% CGST
    const sgst = subTotal * 0.09; // 9% SGST
    const overallTotal = subTotal + cgst + sgst;

    // Convert total amount to words
    const totalInWords = numWords(Math.floor(overallTotal));

    // Read HTML template from file
    const htmlTemplate = await fs.readFile(
      path.join(__dirname, "templates", "invoice.html"),
      "utf-8"
    );

    // Read the image file and convert it to base64 encoding
    const imagePath = path.join(__dirname, "templates", "logo.png");
    const imageData = await fs.readFile(imagePath, { encoding: "base64" });

    // Inject dynamic data into HTML template
    const dynamicContent = htmlTemplate
      .replace(/{{imageData}}/g, imageData)
      .replace(/{{fbo_name}}/g, fbo_name)
      .replace(/{{contact_person}}/g, contact_person)
      .replace(/{{contact_number}}/g, phone)
      .replace(/{{address}}/g, `${line1}, ${line2 || ""}`)
      .replace(/{{invoice_number}}/g, invoice_number)
      .replace(/{{invoice_date}}/g, invoiceDate.toLocaleDateString())
      .replace(/{{outletItems}}/g, outletItems)
      .replace(/{{sub_total}}/g, `₹${subTotal.toFixed(2)}`)
      .replace(/{{cgst}}/g, `₹${cgst.toFixed(2)}`)
      .replace(/{{sgst}}/g, `₹${sgst.toFixed(2)}`)
      .replace(/{{overallTotal}}/g, `₹${overallTotal.toFixed(2)}`)
      .replace(/{{totalInWords}}/g, `${totalInWords} rupees`)
      .replace(/{{field_executive_name}}/g, field_executive_name)
      .replace(/{{team_leader_name}}/g, team_leader_name)
      .replace(/{{proposal_number}}/g, proposal_number)
      .replace(/{{place_of_supply}}/g, place_of_supply)
      .replace(/{{pincode}}/g, pincode);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the base URL to allow relative paths for resources like images
    const baseUrl = `file://${__dirname}/templates/`;
    await page.setContent(dynamicContent, {
      waitUntil: "networkidle0",
      baseUrl,
    });

    // Generate PDF content dynamically based on client input
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    // Set up Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `<${process.env.EMAIL_USERNAME}>`,
      to,
      subject: "Invoice Document",
      text: message,
      attachments: [
        {
          filename: `invoice-${invoice_number}.pdf`,
          content: pdfBuffer,
          encoding: "base64",
        },
      ],
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

    // Update proposal status to "Mail Sent"
    await Invoice.findByIdAndUpdate(invoiceId, { status: "Unpaid/Mail Sent" });

    // Respond to client
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error generating PDF or sending email:", error);
    res.status(500).send("Internal Server Error");
  }
};
