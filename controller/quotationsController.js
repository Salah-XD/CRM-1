import puppeteer from "puppeteer";
import { promises as fs } from "fs";
import path from "path";

const __dirname = path.resolve();

export const generateQuotation = async (req, res) => {
  try {
    const {
      clientName,
      contactPersonName,
      contactPersonNumber,
      address,
      pinCode,
      gstNo,
      industryVertical,
      numberOfFoodHandlers,
      proposalNumber,
      proposalDate,
      formatNumber,
      issueDate,
      versionNumber,
      total,
      gstRate,
      location,
      audit,
      frequency,
      quantity,
      unitCost,
    } = req.body;

    // Calculate GST amount
    const gstAmount = (total * gstRate) / 100;
    const totalAmountWithoutTax = total;
    const tax = gstAmount;

    // Calculate overall total including GST
    const overallTotal = total + gstAmount;
    const totalAmountWithTax = overallTotal;
    // Read HTML template from file
    const htmlTemplate = await fs.readFile(
      path.join(__dirname, "templates", "quotation.html"),
      "utf-8"
    );

    // Read the image file and convert it to base64 encoding
    const imagePath = path.join(__dirname, "templates", "logo.png");
    const imageData = await fs.readFile(imagePath, { encoding: "base64" });

    // Inject dynamic data into HTML template
    const dynamicContent = htmlTemplate
      .replace("{{clientName}}", clientName)
      .replace("{{contactPersonName}}", contactPersonName)
      .replace("{{contactPersonNumber}}", contactPersonNumber)
      .replace("{{address}}", address)
      .replace("{{pinCode}}", pinCode)
      .replace("{{gstNo}}", gstNo)
      .replace("{{industryVertical}}", industryVertical)
      .replace("{{numberOfFoodHandlers}}", numberOfFoodHandlers)
      .replace("{{proposalNumber}}", proposalNumber)
      .replace("{{proposalDate}}", proposalDate)
      .replace("{{issueDate}}", issueDate)
      .replace("{{formatNumber}}", formatNumber)
      .replace("{{versionNumber}}", versionNumber)
      .replace("{{total}}", total)
      .replace("{{gst}}", gstRate)
      .replace("{{overallTotal}}", overallTotal)
      .replace("{{location}}", location)
      .replace("{{audit}}", audit)
      .replace("{{frequnecy}}", frequency)
      .replace("{{quantity}}", quantity)
      .replace("{{unitCost}}", unitCost)
      .replace("{{imageData}}", imageData)
      .replace("{{toatlAmountWithoutTax}}", totalAmountWithoutTax)
      .replace("{{tax}}", tax)
      .replace("{{toatlAmountWithTax}}", totalAmountWithTax);

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

    // Send PDF as response
    res.contentType("application/pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
};
