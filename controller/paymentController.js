import Payment from "../models/paymentModel.js";
import Proposal from "../models/proposalModel.js";
import multer from "multer";
import  path from "path";
import fs from "fs";
import AuditManagement from "../models/auditMangement.js";
import AuditorPayment from "../models/auditorPaymentModal.js";

// Create a new payment
export const createPayment = async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating payment",
      error: error.message,
    });
  }
};

// Get all payments
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json({ success: true, payments });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching payments",
      error: error.message,
    });
  }
};

// Get a single payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment)
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });

    res.status(200).json({ success: true, payment });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching payment",
      error: error.message,
    });
  }
};

// Update a payment by ID
export const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!payment)
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });

    res.status(200).json({
      success: true,
      message: "Payment updated successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating payment",
      error: error.message,
    });
  }
};

// Delete a payment by ID
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment)
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });

    res
      .status(200)
      .json({ success: true, message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting payment",
      error: error.message,
    });
  }
};

export const getAllProposalDetails = async (req, res) => {
  try {
    const { auditor_id } = req.params;
    const { page = 1, pageSize = 10, sort, keyword } = req.query;

    const pageNumber = parseInt(page, 10);
    const sizePerPage = parseInt(pageSize, 10);

    if (isNaN(pageNumber) || pageNumber < 1 || isNaN(sizePerPage) || sizePerPage < 1) {
      return res.status(400).json({ message: "Invalid page or pageSize parameter" });
    }

    // Step 1: Get all proposal IDs linked with the given auditor
    const auditRecords = await AuditManagement.find({ user: auditor_id }).select("proposalId");
    const proposalIds = auditRecords.map((audit) => audit.proposalId);

    // Step 2: Query proposals using the extracted proposalIds
    let query = Proposal.find({ _id: { $in: proposalIds } });

    // Step 3: Apply search filter if provided
    if (keyword) {
      const searchRegex = new RegExp(keyword, "i");
      query = query.where("fbo_name").regex(searchRegex);
    }

    // Step 4: Sorting logic
    let sortQuery = {};
    switch (sort) {
      case "newproposal":
        sortQuery = { createdAt: -1 };
        break;
      case "alllist":
        sortQuery = { createdAt: 1 };
        break;
      default:
        sortQuery = { createdAt: 1 };
        break;
    }

    // Step 5: Count total proposals for pagination
    const totalProposals = await Proposal.countDocuments(query.getQuery());

    // Step 6: Fetch paginated proposals
    const proposals = await query
      .skip((pageNumber - 1) * sizePerPage)
      .limit(sizePerPage)
      .sort(sortQuery)
      .select("proposal_number fbo_name outlets proposal_date status createdAt updatedAt");

    // Step 7: Calculate proposal values
    const proposalsWithCounts = proposals.map((proposal) => {
      const totalOutlets = proposal.outlets.length;
      const notInvoicedOutlets = proposal.outlets.filter((outlet) => !outlet.is_invoiced).length;

      // Calculate Proposal Value
      const total = proposal.outlets.reduce(
        (acc, outlet) => acc + parseFloat(outlet.amount?.$numberInt || outlet.amount || 0),
        0
      );
      const gst = total * 0.18;
      const overallTotal = total + gst;

      return {
        _id: proposal._id,
        proposal_number: proposal.proposal_number,
        fbo_name: proposal.fbo_name,
        totalOutlets,
        notInvoicedOutlets,
        Proposal_value: overallTotal,
      };
    });

    res.json({
      total: totalProposals,
      currentPage: pageNumber,
      data: proposalsWithCounts,
    });
  } catch (error) {
    console.error("Error fetching proposals:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// Ensure the directory exists
const uploadDir = 'uploads/payment-reference/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Save files in 'uploads/payment-reference/' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage });

// Save Auditor Payment Details


export const saveAuditorPayment = async (req, res) => {

  console.log(req.body);
  try {
    const { proposalId, amountReceived, referenceNumber, auditor_id } = req.body;

    if (!proposalId || !amountReceived || !referenceNumber || !auditor_id) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Handling multiple file uploads (images, PDFs)
    const referenceDocuments = req.files
      ? req.files.map((file) => ({
          fileName: file.filename,
          fileType: file.mimetype, // e.g., "image/png", "application/pdf"
          filePath: `payment-reference/${file.filename}`,
        }))
      : [];

    const newPayment = new AuditorPayment({
      proposal: proposalId,
      amountReceived,
      referenceNumber,
      referenceDocuments,
      auditor: auditor_id,
    });

    await newPayment.save();

    res.status(201).json({ message: "Auditor payment details saved successfully!" });
  } catch (error) {
    console.error("Error saving auditor payment:", error);
    res.status(500).json({ message: "Server error" });
  }
};
