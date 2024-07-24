import puppeteer from "puppeteer";
import { promises as fs } from "fs";
import path from "path";
import nodemailer from "nodemailer";
import numWords from "num-words"; // Import num-words library
import Invoice from "../models/invoiceModel.js"; // Import your Invoice model

const __dirname = path.resolve();

export const generateInvoice = async (req, res) => {

  const {invoiceId}=req.params;
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
      proposal_date,
      place_of_supply,
      field_executive_name,
      team_leader_name,
      // Add more fields if needed
    } = invoiceDetails;

    console.log

    // Convert MongoDB date format
    const invoiceDate = invoice_date?.$date?.$numberLong
      ? new Date(parseInt(invoice_date.$date.$numberLong))
      : new Date();

    // Calculate totals and taxes
    let totalAmount = 0;
    let taxableValue = 0;
    outlets.forEach((outlet) => {
      const amount = parseFloat(
        outlet.amount?.$numberInt || outlet.amount || 0
      );
      const gstAmount = (amount * (outlet.gst_rate || 0)) / 100;
      const discount = parseFloat(
        outlet.discount?.$numberInt || outlet.discount || 0
      );
      const taxable = amount - discount;
      totalAmount += amount + gstAmount;
      taxableValue += taxable;

      outlet.total_amount_including_tax = (taxable + gstAmount).toFixed(2);
      outlet.gst_amount = gstAmount.toFixed(2);
      outlet.taxable_value = taxable.toFixed(2);
    });

    const cgst = totalAmount * 0.09; // 9% CGST
    const sgst = totalAmount * 0.09; // 9% SGST
    const overallTotal = totalAmount + cgst + sgst;

    // Convert total amount to words
    const totalInWords = numWords(Math.floor(totalAmount));

    // Read HTML template from file
    const htmlTemplate = await fs.readFile(
      path.join(__dirname, "templates", "invoice.html"),
      "utf-8"
    );

    // Read the image file and convert it to base64 encoding
    const imagePath = path.join(__dirname, "templates", "logo.png");
    const imageData = await fs.readFile(imagePath, { encoding: "base64" });

    // Generate the item content dynamically
    const itemRows = outlets
      .map((outlet) => {
        const quantity = outlet.quantity || 0;
        const unitPrice = outlet.unit_cost?.$numberInt || outlet.unit_cost || 0;
        const amount = outlet.amount?.$numberInt || outlet.amount || 0;
        const discount = outlet.discount?.$numberInt || outlet.discount || 0;
        const gstRate = outlet.gst_rate || 0;

        return `
      <tr>
        <td class="px-2 py-1 text-center">${outlet.outlet_name || ""}</td>
        <td class="px-2 py-1 text-center">${
          outlet.no_of_food_handlers || ""
        }</td>
        <td class="px-2 py-1 text-center">${outlet.man_days}</td>
        <td class="px-2 py-1 text-center">${outlet.unit_cost}</td>
        <td class="px-2 py-1 text-center">${outlet.discount}</td>
        <td class="px-2 py-1 text-center">${outlet.amount}</td>
        <td class="px-2 py-1 text-center">${outlet.sub_total}</td>
        <td class="px-2 py-1 text-center">18%</td>
        <td class="px-2 py-1 text-center">0</td>
          <td class="px-2 py-1 text-center">${outlet.total}</td>
      
      </tr>
    `;
      })
      .join("");

    // Inject dynamic data into HTML template
    const dynamicContent = htmlTemplate
      .replace(/{{fbo_name}}/g, fbo_name)
      .replace(/{{contact_person}}/g, contact_person)
      .replace(/{{contact_number}}/g, phone)
      .replace(/{{address}}/g, `${line1}, ${line2 || ""}`)
    
      .replace(/{{invoice_number}}/g, invoice_number)
      .replace(/{{invoice_date}}/g, invoiceDate.toLocaleDateString())
      .replace(/{{itemRows}}/g, itemRows)
      .replace(/{{imageData}}/g, imageData)
      .replace(/{{total}}/g, totalAmount.toFixed(2))
      .replace(/{{cgst}}/g, cgst.toFixed(2))
      .replace(/{{sgst}}/g, sgst.toFixed(2))
      .replace(/{{overallTotal}}/g, overallTotal.toFixed(2))
      .replace(/{{Total Amount In Word}}/g, totalInWords); // Add the total in words

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

    // Respond to client
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error generating PDF or sending email:", error);
    res.status(500).send("Internal Server Error");
  }
};
