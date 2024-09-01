import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { promises as fs } from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import moment from 'moment';
import Agreement from '../models/agreementModel.js'; // Ensure your model is properly named and imported

const __dirname = path.resolve();

export const generateagreement = async (req, res) => {
  let browser = null;
  try {
    const { agreementId } = req.params;
    const { to, cc, message } = req.body;

    // Fetch agreement details
    const agreementDetails = await Agreement.findById(agreementId).exec();
    if (!agreementDetails) {
      return res.status(404).send('Agreement not found');
    }

    const { fbo_name, from_date, to_date, period, total_cost, address, no_of_outlets } = agreementDetails;

    // Format dates
    const formattedFromDate = moment(from_date).format('DD/MM/YYYY');
    const formattedToDate = moment(to_date).format('DD/MM/YYYY');

    // Read HTML template and image concurrently
    const [htmlTemplate, imageData] = await Promise.all([
      fs.readFile(path.join(__dirname, 'templates', 'agreement.html'), 'utf-8'),
      fs.readFile(path.join(__dirname, 'templates', 'logo2.png'), { encoding: 'base64' })
    ]);

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

    // Launch Puppeteer using Chromium
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    const baseUrl = `file://${__dirname}/templates/`;
    await page.setContent(dynamicContent, { waitUntil: 'networkidle0', baseUrl });

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
      subject: 'Agreement Document',
      html: message,
      attachments: [{
        filename: `agreement-${agreementId}.pdf`,
        content: pdfBuffer,
        encoding: 'base64',
      }],
    };

    // Send email and update agreement status
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    await Agreement.findByIdAndUpdate(agreementId, { status: 'Mail Sent' });

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
