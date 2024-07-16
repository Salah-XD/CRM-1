import Business from "../models/bussinessModel.js";
import Outlet from "../models/outletModel.js";
import Enquiry from "../models/enquiryModel.js";
import Proposal from "../models/proposalModel.js";
import ProposedOutlet from "../models/ProposedOutlet.js";


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
    const outlets = await Outlet.find({ business }, "branch_name _id");

    // Respond with the outlet details for the specified business
    res.json(outlets);
  } catch (error) {
    console.error("Error getting outlets for business:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// export const saveProposal = async (req, res) => {
//   const { enquiryId, proposal_date, status, proposal_number, outlets } =
//     req.body;

//   try {
//     // Find the enquiry using the provided enquiryId
//     const enquiry = await Enquiry.findById(enquiryId).populate("business");

//     if (!enquiry) {
//       return res.status(404).json({ message: "Enquiry not found" });
//     }

//     // Get the business ID from the enquiry
//     const businessId = enquiry.business._id;

//     // Create the proposal
//     const proposal = new Proposal({
//       business: businessId,
//       proposal_date,
//       status,
//       proposal_number,
//       outlets,
//     });

//     // Save the proposal to the database
//     await proposal.save();

//     return res
//       .status(201)
//       .json({ message: "Proposal saved successfully", proposal });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Error saving proposal", error });
//   }
// };


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
  try {
    // Extract data from req.body
    const {
      proposal_date,
      status,
      proposal_number,
      address,
      gst_number,
      contact_person,
      phone,
      outlet_name,
      man_days,
      no_of_food_handlers,
      amount,
      discount,
      unit_cost,
      is_invoiced,
    } = req.body;

    // Create a new Proposal instance
    const proposal = new Proposal({
      proposal_date,
      status,
      proposal_number,
      address,
      gst_number,
      contact_person,
      phone,
    });

    // Save the Proposal to database
    const savedProposal = await proposal.save();

    // Create a new ProposedOutlet instance
    const proposedOutlet = new ProposedOutlet({
      outletDetails: {
        outlet_name,
        man_days,
        no_of_food_handlers,
        amount,
        discount,
        unit_cost,
      },
      proposalModel: savedProposal._id, // Assign the ID of the saved Proposal
      is_invoiced,
    });

    // Save the ProposedOutlet to database
    const savedProposedOutlet = await proposedOutlet.save();

    // Respond with saved data or success message
    res.status(201).json({
      proposal: savedProposal,
      proposedOutlet: savedProposedOutlet,
    });
  } catch (err) {
    // Handle error
    console.error(err);
    res.status(500).json({ error: "Failed to save data" });
  }
};