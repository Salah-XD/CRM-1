import puppeteer from "puppeteer";
import { promises as fs } from "fs";
import path from "path";
import nodemailer from "nodemailer";
import moment from "moment"; // Import moment.js
import agreement from "../models/agreementModel.js";

const __dirname = path.resolve();

export const generateagreement = async (req, res) => {
  try {
    const { agreementId } = req.params; // Access agreementId from route parameters
    const { to, cc,message } = req.body; // Email details

    // Fetch agreement details based on agreementId
    const agreementDetails = await agreement.findById(agreementId).exec();

    if (!agreementDetails) {
      return res.status(404).send("Agreement not found");
    }

    const {
      fbo_name,
      from_date,
      to_date,
      period,
      total_cost,
      address,
      no_of_outlets,
    } = agreementDetails;

    console.log(fbo_name, from_date, to_date, total_cost, no_of_outlets);

    // Format dates using moment.js in the desired format (DD/MM/YYYY)
    const formattedFromDate = moment(from_date).format("DD/MM/YYYY");
    const formattedToDate = moment(to_date).format("DD/MM/YYYY");

    // Read HTML template from file
    const htmlTemplate = await fs.readFile(
      path.join(__dirname, "templates", "agreement.html"),
      "utf-8"
    );

    // Read the image file and convert it to base64 encoding
    const imagePath = path.join(__dirname, "templates", "logo2.png");
    const imageData = await fs.readFile(imagePath, { encoding: "base64" });

    // Inject dynamic data into HTML template
    const dynamicContent = htmlTemplate
      .replace(/{{fbo_name}}/g, fbo_name)
      .replace(/{{imageData}}/g, imageData)
      .replace(/{{address}}/g, address)
      .replace(/{{total_cost}}/g, total_cost)
      .replace(/{{from_date}}/g, formattedFromDate)
      .replace(/{{to_date}}/g, formattedToDate)
      .replace(/{{no_of_outlets}}/g, no_of_outlets)
      .replace(/{{period}}/g, period);

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

    console.log("arun");

    // Set up Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: "unavar.steamtroops@gmail.com",
        pass: "nwgg jdxf emoq enmo",
      },
    });

    const mailOptions = {
      from: "Arun",
      to, // Email recipient from request body
      cc,
      subject: "Agreement Document",
      text: message, // Message body from request body
      attachments: [
        {
          filename: `agreement-${agreementId}.pdf`,
          content: pdfBuffer,
          encoding: "base64",
        },
      ],
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

    // Update agreement status to "Mail Sent"
    await agreement.findByIdAndUpdate(agreementId, { status: "Mail Sent" });

    // Respond to client
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error generating PDF or sending email:", error);
    res.status(500).send("Internal Server Error");
  }
};
