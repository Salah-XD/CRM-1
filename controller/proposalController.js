import Business from "../models/bussinessModel.js";
import Outlet from "../models/outletModel.js";
import Enquiry from "../models/enquiryModel.js";
import Proposal from "../models/proposalModel.js";
import ProposalCounter from "../models/proposalCounter.js";
import moment from "moment"; 
import mongoose from "mongoose";



export const getOutletDetailsById = async (req, res) => {
  try {
    const { enquiryId } = req.params; // Get the enquiry ID from request parameters

    // Find the enquiry that matches the enquiry ID and select the business ID
    const enquiry = await Enquiry.findById(enquiryId).select("business");
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    const { business } = enquiry; // Extract the business ID from the enquiry

    // Find outlets that match the business ID and select only branch name and outlet ID
    const outlets = await Outlet.find(
      { business },
      "branch_name _id  no_of_food_handlers"
    );

    // Respond with the outlet details for the specified business
    res.json(outlets);
  } catch (error) {
    console.error("Error getting outlets for business:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


 export const saveProposal = async (req, res) => {
   const { enquiryId, proposal_date, status, proposal_number, outlets } =
     req.body;

   try {
      //Find the enquiry using the provided enquiryId
     const enquiry = await Enquiry.findById(enquiryId).populate("business");

     if (!enquiry) {
       return res.status(404).json({ message: "Enquiry not found" });
     }

      //Get the business ID from the enquiry
     const businessId = enquiry.business._id;

      //Create the proposal
     const proposal = new Proposal({
       business: businessId,
       proposal_date,
       status,
       proposal_number,
       outlets,
     });

      //Save the proposal to the database
     await proposal.save();

     return res
       .status(201)
       .json({ message: "Proposal saved successfully", proposal });
   } catch (error) {
     console.error(error);
     return res.status(500).json({ message: "Error saving proposal", error });
   }
 };


export const getBusinessDetailsByEnquiryId = async (req, res) => {
  const { enquiryId } = req.params;

  try {
    // Find the enquiry by ID
    const enquiry = await Enquiry.findById(enquiryId);
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    // Get the business ID from the enquiry
    const businessId = enquiry.business;

    // Find the business by ID
    const business = await Business.findOne(
      { _id: businessId },
      "name address  gst_number contact_person phone"
    );
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Return the business details
    res.status(200).json(business);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};




// Controller function to save data
export const createProposalAndOutlet = async (req, res) => {
  console.log(req.body);
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Extract data from req.body
    const {
      fbo_name,
      proposal_date,
      status,
      proposal_number,
      address,
      gst_number,
      contact_person,
      phone,
      outlets,
      enquiryId, 
      pincode
    } = req.body;

    // Create a new Proposal instance with outlets
    const proposal = new Proposal({
      fbo_name,
      proposal_date,
      status,
      proposal_number,
      address,
      gst_number,
      contact_person,
      phone,
      outlets,
      pincode
    });

    // Save the Proposal to the database
    const savedProposal = await proposal.save({ session });

    // Update the ProposalCounter to increment the counter
    await ProposalCounter.findOneAndUpdate(
      { name: "proposalNumber" },
      { $inc: { value: 1 } },
      { new: true, upsert: true, session }
    );

    // Update the Enquiry model's status to "Proposal Done"
    await Enquiry.findByIdAndUpdate(
      enquiryId,
      { status: "Proposal Done" },
      { new: true, session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Respond with saved data or success message
    res.status(201).json({
      proposal: savedProposal,
    });
  } catch (err) {
    // Rollback the transaction in case of error
    await session.abortTransaction();
    session.endSession();

    // Handle error
    console.error(err);
    res.status(500).json({ error: "Failed to save data" });
  }
};



// Generate unique proposal number
export const generateProposalNumber = async (req, res) => {
  try {
    // Find the current counter without incrementing it
    const counter = await ProposalCounter.findOne({ name: "proposalNumber" });

    // Check if the counter exists
    if (!counter) {
      // If no counter found, initialize one with value 0
      const newCounter = new ProposalCounter({
        name: "proposalNumber",
        value: 0,
      });
      await newCounter.save();
      res.json({ proposal_number: "PROP-00000" }); // Generate default proposal number
      return;
    }

    // Generate the proposal number based on the current counter value
    const newProposalNumber = `PROP-${String(counter.value).padStart(5, "0")}`;

    res.json({ proposal_number: newProposalNumber });
  } catch (error) {
    console.error("Error generating proposal number", error);
    res.status(500).json({ error: "Error generating proposal number" });
  }
};




//Get all the proposal Details
export const getAllProposalDetails = async (req, res) => {
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
    let query = Proposal.find();

    // Apply search keyword if provided
    if (keyword) {
      const searchRegex = new RegExp(keyword, "i"); // Case-insensitive regex
      query = query.where("fbo_name").regex(searchRegex);
    }

    // Apply sorting based on the 'sort' parameter
    if (sort === "newest") {
      query = query.sort({ proposal_date: -1 });
    } else if (sort === "oldest") {
      query = query.sort({ proposal_date: 1 });
    }

    // Count total number of proposals
    const totalProposals = await Proposal.countDocuments(query.getQuery());

    // Retrieve proposals with pagination
    const proposals = await query
      .skip((pageNumber - 1) * sizePerPage)
      .limit(sizePerPage)
      .select("fbo_name outlets proposal_date status"); // Select only the required fields

    // Calculate total outlets and invoiced outlets for each proposal
    const proposalsWithCounts = proposals.map((proposal) => {
      // Count total and invoiced outlets
      const totalOutlets = proposal.outlets.length;
      const invoicedOutlets = proposal.outlets.filter(
        (outlet) => outlet.is_invoiced
      ).length;

      const formattedDate = moment(proposal.proposal_date).fromNow(); // Format proposal_date using Moment.js
      return {
        _id:proposal._id,
        fbo_name: proposal.fbo_name,
        totalOutlets, // Total number of outlets
        invoicedOutlets, // Number of invoiced outlets
        proposal_date: formattedDate, // Update proposal_date with formatted date
        status: proposal.status, // Status of the proposal
      };
    });

    res.json({
      total: totalProposals, // Total number of proposals
      currentPage: pageNumber,
      data: proposalsWithCounts,
    });
  } catch (error) {
    console.error("Error fetching proposals:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//Controller to get all the all the outlets
export const getOutletsByProposalId = async (req, res) => {
  const { proposalId } = req.params; // Get the proposal ID from the request parameters

  try {
    // Find the proposal by ID
    const proposal = await Proposal.findById(proposalId).exec();

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    // Return the outlets from the found proposal
    return res.status(200).json(proposal.outlets);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
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