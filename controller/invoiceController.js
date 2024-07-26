import Proposal from "../models/proposalModel.js";
import moment from "moment";
import mongoose from "mongoose";
import InvoiceCounter from "../models/invoiceCounter.js";
import Invoice from "../models/invoiceModel.js";



export const generateInvoiceNumber = async (req, res) => {
  try {
    // Find the current counter without incrementing it
    const counter = await InvoiceCounter.findOne({ name: "invoiceNumber" });

    // Check if the counter exists
    if (!counter) {
      // If no counter found, initialize one with value 0
      const newCounter = new InvoiceCounter({
        name: "invoiceNumber",
        value: 0,
      });
      await newCounter.save();
      res.json({ invoice_number: "INV-00000" }); // Generate default invoice number
      return;
    }

    // Generate the invoice number based on the current counter value
    const newInvoiceNumber = `INV-${String(counter.value).padStart(5, "0")}`;

    res.json({ invoice_number: newInvoiceNumber });
  } catch (error) {
    console.error("Error generating invoice number", error);
    res.status(500).json({ error: "Error generating invoice number" });
  }
};


export const getProposalById = async (req, res) => {
  const { proposalId } = req.params;

  try {
    const proposal = await Proposal.findById(proposalId).select(
      "fbo_name pincode address gst_number proposal_date proposal_number"
    );

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    res.status(200).json(proposal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};




export const createInvoice = async (req, res) => {
  console.log(req.body);
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Destructure the request body to get invoice data
    const {
      fbo_name,
      invoice_date,
      status,
      proposal_number,
      invoice_number,
      place_of_supply,
      field_executive_name,
      team_leader_name,
      address = {}, 
      pincode, 

      contact_person,
      phone,
      outlets,
  
    } = req.body;

    // Create a new invoice instance with the provided data
    const newInvoice = new Invoice({
      fbo_name,
      invoice_date,
      status,
      proposal_number,
      invoice_number,
      place_of_supply,
      field_executive_name,
      team_leader_name,
      address,
      pincode, 
      contact_person,
      phone,
      outlets,
     
    });

    // Save the new invoice to the database
    const savedInvoice = await newInvoice.save({ session });

    // Update the InvoiceCounter collection
    await InvoiceCounter.findOneAndUpdate(
      { name: "invoiceNumber" },
      { $inc: { value: 1 } },
      { new: true, upsert: true, session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Send a response with the saved invoice data
    res.status(201).json({
      success: true,
      message: "Invoice created successfully!",
      data: savedInvoice,
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    // Rollback the transaction in case of error
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      success: false,
      message: "Failed to create invoice",
      error: error.message,
    });
  }
};




//Get all the proposal Details
export const getAllInvoiceDetail = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, sort, keyword } = req.query;

    // Convert page and pageSize to integers
    const pageNumber = parseInt(page, 10);
    const sizePerPage = parseInt(pageSize, 10);

    // Validate page number and page size
    if (
      isNaN(pageNumber) ||
      pageNumber < 1 ||
      isNaN(sizePerPage) ||
      sizePerPage < 1
    ) {
      return res
        .status(400)
        .json({ message: "Invalid page or pageSize parameter" });
    }

    // Create the base query
    let query = Invoice.find();

    // Apply search keyword if provided
    if (keyword) {
      const searchRegex = new RegExp(keyword, "i"); // Case-insensitive regex
      query = query.where({
        $or: [
          { fbo_name: { $regex: searchRegex } },
          { proposal_number: { $regex: searchRegex } },
          { phone: { $regex: searchRegex } },
          { status: { $regex: searchRegex } },
        ],
      });
    }

    // Apply sorting based on the 'sort' parameter
    if (sort === "allist") {
      query = query.sort({ invoice_date: -1 });
    } else if (sort === "newinvoice") {
      query = query.sort({ invoice_date: 1 });
    }

    // Count total number of invoices
    const totalInvoices = await Invoice.countDocuments(query.getQuery());

    // Retrieve invoices with pagination
    const invoices = await query
      .skip((pageNumber - 1) * sizePerPage)
      .limit(sizePerPage)
      .select("fbo_name proposal_number phone outlets invoice_date status"); // Select only the required fields

    // Calculate total outlets and invoiced outlets for each invoice
    const invoicesWithCounts = invoices.map((invoice) => {
      // Count total and invoiced outlets
      const totalOutlets = invoice.outlets.length;
      const invoicedOutlets = invoice.outlets.filter(
        (outlet) => outlet.is_invoiced
      ).length;

      const formattedDate = moment(invoice.invoice_date).fromNow(); // Format invoice_date using Moment.js
      return {
        _id: invoice._id,
        fbo_name: invoice.fbo_name,
        proposal_number: invoice.proposal_number,
        phone: invoice.phone,
        invoice_date: formattedDate, // Update invoice_date with formatted date
        status: invoice.status, // Status of the invoice
        totalOutlets: totalOutlets, // Total outlets
        invoicedOutlets: invoicedOutlets, // Invoiced outlets
      };
    });

    res.json({
      total: totalInvoices, // Total number of invoices
      currentPage: pageNumber,
      data: invoicesWithCounts,
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteFields = async (req, res) => {
  try {
    const arrayOfInvoiceId = req.body;

    // Validate arrayOfInvoiceId if necessary
    if (!Array.isArray(arrayOfInvoiceId)) {
      return res
        .status(400)
        .json({ error: "Invalid input: Expected an array of Invoice IDs" });
    }

    // Perform deletions
    const deletionPromises = arrayOfInvoiceId.map(async (proposalId) => {
      // Delete Invoice document
      await Invoice.deleteOne({ _id: proposalId });
    });

    // Wait for all deletion operations to complete
    await Promise.all(deletionPromises);

    res.status(200).json({ message: "Invoices deleted successfully" });
  } catch (err) {
    console.error("Error deleting proposals:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};