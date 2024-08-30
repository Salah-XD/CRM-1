import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { promises as fs } from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import Proposal from '../models/proposalModel.js';

const __dirname = path.resolve();

export const generateProposal = async (req, res) => {
  let browser = null;
  try {
    const { proposalId } = req.params;
    const { to, cc, message } = req.body;

    // Fetch proposal details and read files concurrently
    const [proposalDetails, htmlTemplate, imageData] = await Promise.all([
      Proposal.findById(proposalId).exec(),
      fs.readFile(path.join(__dirname, 'templates', 'proposal.html'), 'utf-8'),
      fs.readFile(path.join(__dirname, 'templates', 'logo2.png'), { encoding: 'base64' }),
    ]);

    if (!proposalDetails) {
      return res.status(404).send('Proposal not found');
    }

    const { fbo_name, contact_person, phone, address: { line1, line2 }, gst_number, outlets, proposal_number, proposal_date, pincode } = proposalDetails;

    // Calculate totals
    const total = outlets.reduce((acc, outlet) => acc + parseFloat(outlet.amount.$numberInt || outlet.amount), 0);
    const cgst = parseFloat((total * 0.09).toFixed(2));
    const sgst = parseFloat((total * 0.09).toFixed(2));
    const overallTotal = parseFloat((total + cgst + sgst).toFixed(2));

    // Parse proposal date
    const proposalDate = proposal_date?.$date?.$numberLong
      ? new Date(parseInt(proposal_date.$date.$numberLong))
      : new Date();

    // Generate outlet rows
    const outletRows = outlets.map(outlet => {
      const postfix = {
        'Transportation': 'VH',
        'Catering': 'FH',
        'Trade and Retail': 'Sq ft',
        'Manufacturing': 'PD/Line',
      }[outlet.type_of_industry] || '';

      const outletName = outlet.outlet_name || '';
      const description = outlet.description || '';
      const service = outletName === 'Others' ? 'N/A' : `${outlet.unit || ''} ${postfix}`;
      const manDays = outletName === 'Others' ? 'N/A' : (outlet.man_days?.$numberDouble || outlet.man_days || 0);
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
    }).join('');

    // Replace placeholders in template in one go
    const dynamicContent = htmlTemplate
      .replace(/{{fbo_name}}/g, fbo_name)
      .replace(/{{contact_person}}/g, contact_person)
      .replace(/{{contactPersonNumber}}/g, phone)
      .replace(/{{address}}/g, `${line1}, ${line2}`)
      .replace(/{{gst_number}}/g, gst_number)
      .replace(/{{proposalNumber}}/g, proposal_number)
      .replace(/{{proposalDate}}/g, proposalDate.toLocaleDateString())
      .replace(/{{outletRows}}/g, outletRows)
      .replace(/{{imageData}}/g, imageData)
      .replace(/{{total}}/g, total)
      .replace(/{{cgst}}/g, cgst)
      .replace(/{{sgst}}/g, sgst)
      .replace(/{{pincode}}/g, pincode)
      .replace(/{{overallTotal}}/g, overallTotal);

    // Launch Puppeteer
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
      waitUntil: 'networkidle0',
      baseUrl,
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    // Set up Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
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
      subject: 'Proposal Document',
      text: message,
      attachments: [
        {
          filename: `proposal-${proposalId}.pdf`,
          content: pdfBuffer,
          encoding: 'base64',
        },
      ],
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    // Update proposal status
    await Proposal.findByIdAndUpdate(proposalId, { status: 'Mail Sent' });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error generating PDF or sending email:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
