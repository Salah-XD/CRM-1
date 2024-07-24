import puppeteer from "puppeteer";
import { promises as fs } from "fs";
import path from "path";
import nodemailer from "nodemailer";
import Proposal from "../models/proposalModel.js";
import Invoice from "../models/invoiceModel.js";

const __dirname = path.resolve();

export const generateProposal = async (req, res) => {
  try {
    const { proposalId } = req.params; // Access proposalId from route parameters
    const { to, message } = req.body; // Email details

    // Fetch proposal details based on proposalId
    const proposalDetails = await Proposal.findById(proposalId).exec();

    if (!proposalDetails) {
      return res.status(404).send("Proposal not found");
    }

    const {
      fbo_name,
      phone,
      address: { line1, line2 },
      gst_number,
      outlets,
      proposal_date,
      pincode,
      invoice_number,
      invoice_date,
      field_executive_name,
      team_leader_name,
      proposal_number

    } = proposalDetails;

    // Calculate total, cgst, sgst, and total
    let sub_total = 0;
    outlets.forEach((outlet) => {
       sub_total += parseFloat(outlet.amount.$numberInt || outlet.amount);
    });

    const cgst =  sub_total * 0.09; // 9% CGST
    const sgst =  sub_total * 0.09; // 9% SGST
    const total =  sub_total + cgst + sgst;

    // Convert MongoDB date format
    const proposalDate = proposal_date?.$date?.$numberLong
      ? new Date(parseInt(proposal_date.$date.$numberLong))
      : new Date(); // Fallback to current date if undefined

    // Read HTML template from file
    const htmlTemplate = await fs.readFile(
      path.join(__dirname, "templates", "proposal.html"),
      "utf-8"
    );

    // Read the image file and convert it to base64 encoding
    const imagePath = path.join(__dirname, "templates", "logo.png");
    const imageData = await fs.readFile(imagePath, { encoding: "base64" });

    // Generate the outlet content dynamically
    const outletRows = outlets
      .map((outlet) => {
        const noOfFoodHandlers =
          outlet.no_of_food_handlers?.$numberInt ||
          outlet.no_of_food_handlers ||
          0;
        const manDays = outlet.man_days?.$numberDouble || outlet.man_days || 0;
        const unitCost = outlet.unit_cost?.$numberInt || outlet.unit_cost || 0;
        const discount = outlet.discount?.$numberInt || outlet.discount || 0;
        const amount = outlet.amount?.$numberInt || outlet.amount || 0;

        return `
      <tr>
        <td class="">${outlet.outlet_name || ""}</td>
        <td class="border text-center">${noOfFoodHandlers}</td>
        <td class="border text-center">${manDays}</td>
        <td class="border text-center">${unitCost}</td>
        <td class="border text-center">${discount}</td>
        <td class="border">${amount}</td>
      </tr>
    `;
      })
      .join("");

    // Inject dynamic data into HTML template
    const dynamicContent = htmlTemplate
    .replace(/{{imageData}}/g, imageData)
      .replace(/{{fbo_name}}/g, fbo_name)
      .replace(/{{invoice_numer}}/g, invoice_number)
      .replace(/{{invoice_date}}/g, invoice_date.toLocaleDateString())
      .replace(/{{proposal_number}}/g, proposal_number)
      .replace(/{{address}}/g, `${line1}, ${line2 || ""}`)
      .replace(/{{field_executive_name}}/g, field_executive_name)
      .replace(/{{team_leader_name}}/g, team_leader_name)
      .replace(/{{gst_number}}/g,gst_number)
      .replace(/{{pincode}}/g, pincode)
      .replace(/{{sub_total}}/g, totalAmount.toFixed(2)) // Ensure toFixed to 2 decimal places
      .replace(/{{cgst}}/g, cgst.toFixed(2)) // Ensure toFixed to 2 decimal places
      .replace(/{{sgst}}/g, sgst.toFixed(2)) // Ensure toFixed to 2 decimal places
      .replace(/{{total}}/g, total.toFixed(2)); // Ensure toFixed to 2 decimal places

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the base URL to allow relative paths for resources like images
    const baseUrl = `file://${__dirname}/templates/`;
    await page.setContent(dynamicContent, {
      waitUntil: "networkidle0",
      baseUrl,
    });

    // Generate PDF content dynamically based on client input
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true }); // Generate PDF in A4 format
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
      to, // Email recipient from request body
      subject: "Proposal Document",
      text: message, // Message body from request body
      attachments: [
        {
          filename: `proposal-${proposalId}.pdf`,
          content: pdfBuffer,
          encoding: "base64",
        },
      ],
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

    // Update proposal status to "Mail Sent"
    await Invoice.findByIdAndUpdate(invoiceId, { status: "Mail Sent" });

    // Respond to client
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error generating PDF or sending email:", error);
    res.status(500).send("Internal Server Error");
  }
};
