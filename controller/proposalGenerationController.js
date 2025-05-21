import puppeteer from "puppeteer";
import { promises as fs } from "fs";
import path from "path";
import nodemailer from "nodemailer";
import Proposal from "../models/proposalModel.js";
import CompanyDetail from "../models/CompanyDetail.js";
import BankDetail from "../models/BankDetailModel.js";
import moment from "moment/moment.js";

const __dirname = path.resolve();

export const generateProposal = async (req, res) => {
  let browser = null;
  try {
    const { proposalId } = req.params;
    const { to, cc, message } = req.body;

    // Fetch proposal details and read files concurrently
    const [
      proposalDetails,
      companyDetails,
      bankDetails,
      htmlTemplate,
      imageData,
    ] = await Promise.all([
      Proposal.findById(proposalId).exec(),
      CompanyDetail.findOne().exec(), // Fetch the first record from CompanyDetail
      BankDetail.findOne().exec(), // Fetch the first record from BankDetail
      fs.readFile(path.join(__dirname, "templates", "proposal.html"), "utf-8"),
      fs.readFile(path.join(__dirname, "templates", "logo2.png"), {
        encoding: "base64",
      }),
    ]);

    if (!proposalDetails) {
      return res.status(404).send("Proposal not found");
    }

    if (!bankDetails || !companyDetails) {
      return res.status(500).send("Company or Bank details not found");
    }

    const { company_name, company_address, contact_number, email, gstin, PAN } =
      companyDetails;

    const {
      account_holder_name,
      account_number,
      bank_name,
      branch_name,
      ifsc_code,
    } = bankDetails;

    const {
      fbo_name,
      contact_person,
      phone,
      address: { line1, line2 },
      gst_number,
      outlets,
      proposal_number,
      proposal_date,
      pincode,
      same_state,
    } = proposalDetails;

    const formattedDate = moment(proposal_date).format("MMMM D, YYYY");

    // Calculate totals
    const total = outlets.reduce(
      (acc, outlet) =>
        acc + parseFloat(outlet.amount?.$numberInt ?? outlet.amount ?? 0),
      0
    );

    // Initialize tax variables
    let cgst = 0;
    let sgst = 0;
    let igst = 0;
    let overallTotal = 0;

    if (same_state) {
      cgst = parseFloat((total * 0.09).toFixed(2)); // 9% CGST
      sgst = parseFloat((total * 0.09).toFixed(2)); // 9% SGST
      overallTotal = parseFloat((total + cgst + sgst).toFixed(2));
    } else {
      igst = parseFloat((total * 0.18).toFixed(2)); // 18% GST
      overallTotal = parseFloat((total + igst).toFixed(2));
    }

    // Tax details to be displayed in the table
    const tax = same_state
      ? `
  <tr>
    <td colspan="6" class="border text-right w-3/4 small-cell">
      <strong class="font-medium">CGST [9%]</strong>
    </td>
    <td class="border w-1/4 small-cell text-center"><strong class="font-medium">₹${cgst}</strong></td>
  </tr>
  <tr>
    <td colspan="6" class="border text-right w-3/4 small-cell">
      <strong class="font-medium">SGST [9%]</strong>
    </td>
    <td class="border w-1/4 small-cell text-center"><strong class="font-medium">₹${sgst}</strong></td>
  </tr>
`
      : `
  <tr>
    <td colspan="6" class="border text-right w-3/4 small-cell">
      <strong class="font-medium">IGST [18%]</strong>
    </td>
    <td class="border w-1/4 small-cell text-center"><strong class="font-medium">₹${igst}</strong></td>
  </tr>
`;

    const tax2 = same_state
      ? `  <tr>
              <td class="w-1/2 border px-4 py-1"><strong class="font-medium">CGST9 [9%]</strong></td>
              <td class="w-1/2 border px-4 py-1"><strong class="font-medium">₹${cgst}</strong></td>
            </tr>
            <tr>
              <td class="w-1/2 border px-4 py-1"><strong class="font-medium">SGST9 [9%]</strong></td>
              <td class="w-1/2 border px-4 py-1"><strong class="font-medium">₹${sgst}</strong></td>
            </tr>
            <tr>`
      : ` <tr>
              <td class="w-1/2 border px-4 py-1"><strong class="font-medium">IGST [18%]</strong></td>
              <td class="w-1/2 border px-4 py-1"><strong class="font-medium">₹${igst}</strong></td>
            </tr>`;

    // Parse proposal date
    const proposalDate = proposal_date?.$date?.$numberLong
      ? new Date(parseInt(proposal_date.$date.$numberLong))
      : new Date();

    // Generate outlet rows
    const outletRows = outlets
      .map((outlet) => {
        const postfix =
          {
            Transportation: "VH",
            Catering: "FH",
            "Trade and Retail": "Sq ft",
            Manufacturing: "PD/Line",
          }[outlet.type_of_industry] || "";

        const outletName = outlet.outlet_name || "";
        const description = outlet.description || "";
        const service =
          outletName === "Others" ? "N/A" : `${outlet.unit || ""} ${postfix}`;
        const manDays =
          outletName === "Others"
            ? "N/A"
            : outlet.man_days?.$numberDouble || outlet.man_days || 0;
        const quantity = outlet.quantity?.$numberInt || outlet.quantity || 0;
        const unitCost = outlet.unit_cost?.$numberInt || outlet.unit_cost || 0;
        const amount = outlet.amount?.$numberInt || outlet.amount || 0;

        return ` 
        <tr>
          <td class="px-2 py-1 text-center">${outletName}</td>
          <td class="px-2 py-1 text-center">${description}</td>
          <td class="px-2 py-1 text-center">${service}</td>
          <td class="px-2 py-1 text-center">${manDays}</td>
          <td class="px-2 py-1 text-center">${quantity}</td>
          <td class="px-2 py-1 text-center">${unitCost}</td>
          <td class="px-2 py-1 text-center">${amount}</td>
        </tr>
      `;
      })
      .join("");

    // Replace placeholders in template in one go
    const dynamicContent = htmlTemplate
      .replace(/{{fbo_name}}/g, fbo_name)
      .replace(/{{contact_person}}/g, contact_person)
      .replace(/{{contactPersonNumber}}/g, phone)
      .replace(/{{address}}/g, `${line1}, ${line2}`)
      .replace(/{{gst_number}}/g, gst_number)
      .replace(/{{proposalNumber}}/g, proposal_number)
      .replace(/{{outletRows}}/g, outletRows)
      .replace(/{{imageData}}/g, imageData)
      .replace(/{{total}}/g, total)
      .replace(/{{cgst}}/g, cgst)
      .replace(/{{sgst}}/g, sgst)
      .replace(/{{pincode}}/g, pincode)
      .replace(/{{overallTotal}}/g, overallTotal)
      .replace(/{{tax}}/g, tax)
      .replace(/{{tax2}}/g, tax2)
      .replace(/{{formattedDate}}/g, formattedDate)
      .replace(/{{company_name}}/g, company_name)
      .replace(
        /{{company_address}}/g,
        `${company_address.line1} ${company_address.line2}\n${company_address.city} ${company_address.state} ${company_address.pincode}`
      )
      .replace(/{{contact_number}}/g, contact_number)
      .replace(/{{email}}/g, email)
      .replace(/{{gstin}}/g, gstin)
      .replace(/{{PAN}}/g, PAN)
      .replace(/{{account_holder_name}}/g, account_holder_name)
      .replace(/{{account_number}}/g, account_number)
      .replace(/{{bank_name}}/g, bank_name)
      .replace(/{{branch_name}}/g, branch_name)
      .replace(/{{ifsc_code}}/g, ifsc_code);

    // Launch Puppeteer using Chromium
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(dynamicContent, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    // Set up Nodemailer
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 2525, // Port 2525 (STARTTLS)
      secure: false, // No SSL for port 2525
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASSWORD,
      },
    });

    const mailOptions = {
    from: '"Unavar Food Inspection and Certification Private Limited " <unavar.steamtroops@gmail.com>',
      to,
      cc,
      subject: "Proposal Document",
      html: message,
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
    // console.log("Email sent:", info.response);

    // Update proposal status
    await Proposal.findByIdAndUpdate(proposalId, { status: "Mail Sent" });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error generating PDF or sending email:", error);
    console.error("Puppeteer error:", error.message);
    console.error("Stack trace:", error.stack);

    res.status(500).send("Internal Server Error");
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
