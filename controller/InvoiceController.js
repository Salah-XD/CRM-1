import puppeteer from "puppeteer";
import { promises as fs } from "fs";
import path from "path";

const __dirname = path.resolve();

export const generatePDF = async (req, res) => {
  const { name } = req.body; // assuming you're sending 'name' from client

  try {
    // Fetch dynamic data from the server (replace this with your actual data fetching logic)
    const dynamicData = {
      clientName: "Client A",
      contactPersonName: "John Doe",
      contactPersonNumber: "+123456789",
      address: "123 Main Street",
      pinCode: "12345",
      gstNo: "123456789",
      industryVertical: "Food Industry",
      numberOfFoodHandlers: 5,
      proposalNumber: "PRO123",
      proposalDate: "2024-05-30",
    };

    // Read HTML template from file
    const htmlTemplate = await fs.readFile(
      path.join(__dirname, "templates", "quotation.html"),
      "utf-8"
    );

    // Read the image file and convert it to base64 encoding
    const imagePath = path.join(__dirname, "templates", "shoe.jpg");
    const imageData = await fs.readFile(imagePath, { encoding: "base64" });

    // Inject dynamic data into HTML template
    const dynamicContent = htmlTemplate
      .replace("{{clientName}}", dynamicData.clientName)
      .replace("{{contactPersonName}}", dynamicData.contactPersonName)
      .replace("{{contactPersonNumber}}", dynamicData.contactPersonNumber)
      .replace("{{address}}", dynamicData.address)
      .replace("{{pinCode}}", dynamicData.pinCode)
      .replace("{{gstNo}}", dynamicData.gstNo)
      .replace("{{industryVertical}}", dynamicData.industryVertical)
      .replace("{{numberOfFoodHandlers}}", dynamicData.numberOfFoodHandlers)
      .replace("{{proposalNumber}}", dynamicData.proposalNumber)
      .replace("{{proposalDate}}", dynamicData.proposalDate)
      .replace("{{imageData}}", imageData);

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
