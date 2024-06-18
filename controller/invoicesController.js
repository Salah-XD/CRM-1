import puppeteer from "puppeteer";
import { promises as fsPromises, createWriteStream } from "fs";
import path from "path";
import archiver from "archiver";
import { fileURLToPath } from "url";
import converter from 'number-to-words'; // Importing the number-to-words library

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Mock function to fetch outlet details based on outlet ID
// Replace this with your actual data fetching logic
const fetchOutletDetails = async (outletId) => {
  // Mock data

  if(outletId==123){
 return {
    name: "outlet 1",
    address: "Mock Outlet Address",
    gstin: "1234567890",
    state: "Mock State",
    stateCode: "12",
    // Additional fields if needed
  };
  }
 

  if(outletId==321){
     return {
    name: "outlet 2",
    address: "Mock Outlet Address",
    gstin: "1234567890",
    state: "Mock State",
    stateCode: "12",
    // Additional fields if needed
  };
  }
};

export const generateInvoices = async (req, res) => {

    console.log(req.body);
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
      invoiceNumber,
      fieldExecutiveName,
      teamLeaderName,
      orderRefNo,
      custPONo,
      outletIds, // Array of outlet IDs
      service,
      uom,
      qty,
      rate,
      amount,
      discount,
      taxableValue,
      igst,
      cgst,
      sgst,
      gstCharge,
      invoiceDate,
    } = req.body;

    // Calculate GST amount
    const gstAmount = (total * gstRate) / 100;
    const totalAmountWithoutTax = total;
    const tax = gstAmount;

    // Calculate overall total including GST
    const overallTotal = total + gstAmount;
    const totalAmountWithTax = overallTotal;

    // Convert total amount to words
    const totalAmountInWord = converter.toWords(overallTotal).toUpperCase(); // Convert and make uppercase

    // Read HTML template from file
    const htmlTemplate = await fsPromises.readFile(
      path.join(__dirname, "../templates", "invoice.html"),
      "utf-8"
    );

    // Read the image file and convert it to base64 encoding
    const imagePath = path.join(__dirname, "../templates", "logo.png");
    const imageData = await fsPromises.readFile(imagePath, {
      encoding: "base64",
    });

    // Create a zip archive to store all PDFs
    const zipPath = path.join(__dirname, "invoices.zip");
    const output = createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.pipe(output);

    for (const outletId of outletIds) {
      const outletDetails = await fetchOutletDetails(outletId);

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
        .replace("{{frequency}}", frequency)
        .replace("{{quantity}}", quantity)
        .replace("{{unitCost}}", unitCost)
        .replace("{{imageData}}", imageData)
        .replace("{{toatlAmountWithoutTax}}", totalAmountWithoutTax)
        .replace("{{tax}}", tax)
        .replace("{{toatlAmountWithTax}}", totalAmountWithTax)
        .replace("{{Invoice Number}}", invoiceNumber)
        .replace("{{Field Executive Name}}", fieldExecutiveName)
        .replace("{{Team Leader Name}}", teamLeaderName)
        .replace("{{Order Ref No}}", orderRefNo)
        .replace("{{Cust. P.O. No}}", custPONo)
        .replace("{{Customer Name}}", outletDetails.name)
        .replace("{{Customer Address}}", outletDetails.address)
        .replace("{{Customer GSTIN}}", outletDetails.gstin)
        .replace("{{State}}", outletDetails.state)
        .replace("{{State Code}}", outletDetails.stateCode)
        .replace("{{Service}}", service)
        .replace("{{UOM}}", uom)
        .replace("{{Qty}}", qty)
        .replace("{{Rate}}", rate)
        .replace("{{Amount}}", amount)
        .replace("{{Discount}}", discount)
        .replace("{{Taxable Value}}", taxableValue)
        .replace("{{IGST}}", igst)
        .replace("{{CGST}}", cgst)
        .replace("{{SGST}}", sgst)
        .replace("{{Total Amount}}", overallTotal)
        .replace("{{Gst Charge}}", gstCharge)
        .replace("{{GST Rate}}", gstRate)
        .replace("{{GST Amount}}", gstAmount)
        .replace("{{Total Amount Including Tax}}", overallTotal)
        .replace("{{Amount Before Tax}}", amount)
        .replace("{{Invoice Date}}", invoiceDate)
        .replace("{{Total Amount In Word}}", totalAmountInWord); // Add total amount in words

      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.setContent(dynamicContent, {
        waitUntil: "networkidle0",
      });

      const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

      await browser.close();

      // Add PDF to the zip archive
      archive.append(pdfBuffer, { name: `${outletDetails.name}.pdf` });
    }

    // Finalize the archive
    await archive.finalize();

    // Send the zip file as a response
    output.on("close", () => {
      res.download(zipPath, "invoices.zip", (err) => {
        if (err) {
          console.error("Error sending the file:", err);
          res.status(500).send("Error sending the file");
        } else {
          console.log("File sent successfully");
        }
      });
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Internal Server Error");
  }
};
