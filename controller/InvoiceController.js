import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoice = (req, res) => {
  const {
    invoiceNo,
    invoiceDate,
    orderRefNo,
    teamLeaderName,
    customerName,
    customerAddress,
    customerGSTIN,
    state,
    stateCode,
    services,
    bankDetails,
  } = req.body;

  const doc = new PDFDocument();
  const filePath = path.join(process.cwd(), "invoice.pdf");
  doc.pipe(fs.createWriteStream(filePath));

  doc
    .fontSize(16)
    .text("UNAVAR FOOD INSPECTION AND CERTIFICATION PRIVATE LIMITED", {
      align: "center",
    });
  doc
    .fontSize(12)
    .text("MM ILLAM MKN ROAD, ALANDUR CHENNAI - 600016.", { align: "center" });
  doc.text("Tel: + 9894398096 / Email ID: vivekanand@unavar.com", {
    align: "center",
  });
  doc.text("GSTIN: 33AADCU1306M1ZI | PAN: AADCU1306M", { align: "center" });

  doc.moveDown();
  doc.fontSize(14).text("TAX INVOICE", { align: "center" });

  doc.moveDown();
  doc.fontSize(12).text(`Invoice No: ${invoiceNo}`);
  doc.text(`Invoice date: ${invoiceDate}`);
  doc.text(`Order Ref No: ${orderRefNo}`);
  doc.text(`Team Leader Name: ${teamLeaderName}`);

  doc.moveDown();
  doc.text(`Bill to Party`);
  doc.text(`Name: ${customerName}`);
  doc.text(`Address: ${customerAddress}`);
  doc.text(`GSTIN: ${customerGSTIN}`);
  doc.text(`State (Place of Supply): ${state}`);
  doc.text(`State Code: ${stateCode}`);

  doc.moveDown();
  doc.text(`SAC : 998399 (18%)`);

  // Table headers
  doc.moveDown();
  doc.text("Services Rendered", { continued: true });
  doc.text("UOM", { align: "right" });
  doc.text("Qty", { align: "right" });
  doc.text("Rate", { align: "right" });
  doc.text("Amount", { align: "right" });
  doc.text("Discount", { align: "right" });
  doc.text("Taxable value", { align: "right" });

  // Table rows
  services.forEach((service) => {
    doc.text(service.name, { continued: true });
    doc.text(service.uom, { align: "right" });
    doc.text(service.qty, { align: "right" });
    doc.text(service.rate, { align: "right" });
    doc.text(service.amount, { align: "right" });
    doc.text(service.discount, { align: "right" });
    doc.text(service.taxableValue, { align: "right" });
  });

  doc.moveDown();
  doc.text(
    "Total Invoice amount in words: Seventy Thousand Eight Hundred Only"
  );
  doc.text("Add: IGST");
  doc.text("Add: CGST");
  doc.text("Add: SGST");
  doc.text("Total Amount after Tax:");

  doc.moveDown();
  doc.text("Bank Account Details");
  doc.text(`Account Holder's Name: ${bankDetails.accountHolderName}`);
  doc.text(`Bank Name: ${bankDetails.bankName}`);
  doc.text(`Bank Branch: ${bankDetails.bankBranch}`);
  doc.text(`IFSC Code: ${bankDetails.ifscCode}`);
  doc.text(`Account No: ${bankDetails.accountNumber}`);

  doc.moveDown();
  doc.text("Certified that the particulars given above are true and correct");
  doc.text("For UNAVAR Food Inspection & Certification Pvt Ltd", {
    align: "right",
  });
  doc.text("Authorised signatory", { align: "right" });

  doc.moveDown();
  doc.text("Declaration:");
  doc.text("1. E&O.E,");
  doc.text("2. Please Quote Invoice no while making payment,");
  doc.text(
    "3. Invoice Payable within 7 days failing which interest @2% per month will be charged."
  );

  doc.moveDown();
  doc.text("Udyog Aadhar No. UDYAM-TN-02-0162170");
  doc.text(
    "Payment to be made as per our agreed terms. Delay in payment to us beyond 45 days from the date of receipt of invoice would attract interest of 24% p.a. as per MSMED Act, 2006."
  );

  doc.end();

  res.status(200).json({ message: "Invoice generated successfully", filePath });
};
