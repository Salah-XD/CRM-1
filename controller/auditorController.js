import Proposal from "../models/proposalModel.js"
import Auditor from "../models/auditorModel.js";

// Create a new auditor
export const createAuditor = async (req, res) => {
  try {
    const { auditor_name } = req.body;
    if (!auditor_name) {
      return res.status(400).json({ message: "Auditor name is required" });
    }

    const newAuditor = new Auditor({ auditor_name });
    await newAuditor.save();
    res.status(201).json(newAuditor);
  } catch (error) {
    res.status(500).json({ message: "Error creating auditor", error });
  }
};

// Get all auditors
export const getAllAuditors = async (req, res) => {
  try {
    const auditors = await Auditor.find();
    res.status(200).json(auditors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching auditors", error });
  }
};

// Get a single auditor by ID
export const getAuditorById = async (req, res) => {
  try {
    const { id } = req.params;
    const auditor = await Auditor.findById(id);

    if (!auditor) {
      return res.status(404).json({ message: "Auditor not found" });
    }

    res.status(200).json(auditor);
  } catch (error) {
    res.status(500).json({ message: "Error fetching auditor", error });
  }
};

// Update an auditor by ID
export const updateAuditor = async (req, res) => {
  try {
    const { id } = req.params;
    const { auditor_name } = req.body;

    const updatedAuditor = await Auditor.findByIdAndUpdate(
      id,
      { auditor_name },
      { new: true }
    );

    if (!updatedAuditor) {
      return res.status(404).json({ message: "Auditor not found" });
    }

    res.status(200).json(updatedAuditor);
  } catch (error) {
    res.status(500).json({ message: "Error updating auditor", error });
  }
};

// Delete an auditor by ID
export const deleteAuditor = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAuditor = await Auditor.findByIdAndDelete(id);

    if (!deletedAuditor) {
      return res.status(404).json({ message: "Auditor not found" });
    }

    res.status(200).json({ message: "Auditor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting auditor", error });
  }
};

// Function to send outlet data to an external API
const sendOutletData = async (outletData) => {
  try {
    const response = await axios.post('https://example.com/api/outlet', outletData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`Error sending outlet data for ${outletData.outletName}:`, error.message);
    return { success: false, error: error.message };
  }
};

export const processProposalsWithOutlets = async (req, res) => {
  try {
    // Fetch all proposals along with their outlets
    const proposals = await Proposal.find().populate('enquiryId assigned_auditor');
    const apiResponses = []; // Collects response status for each outlet

    // Loop through each proposal
    for (const proposal of proposals) {
      console.log(`Processing Proposal: ${proposal.proposal_number}`);

     let auditNumber=1;

      // Loop through each outlet in the current proposal
      for (const outlet of proposal.outlets) {
        console.log(`Sending data for Outlet: ${outlet.outlet_name}, Proposal: ${proposal.proposal_number}`);
        
        
        // Prepare outlet data to send to external API
        const outletData = {
          auditNumber:auditNumber,
          proposalNumber: proposal.proposal_number,
          fboName: proposal.fbo_name,
          outletName: outlet.outlet_name,
          outletManDays: outlet.man_days,
          outletType: outlet.type_of_industry,
          amount: outlet.amount,
          status:outlet.is_assignedAuditor,
          dateAndTime:proposal.createdAt,
        };
        auditNumber++;

       console.log(outletData);
      }
    }





    

    // Send a consolidated response with the status of each outlet's data send operation
    res.status(200).json({ message: 'Processed all proposals and outlets successfully', apiResponses });
  } catch (error) {
    console.error('Error processing proposals and outlets:', error);
    res.status(500).json({ message: 'Error processing proposals and outlets', error });
  }
};



// for (let i = 0; i < proposals.length; i++) {
//   const proposal = proposals[i];
//   console.log(`Processing Proposal: ${proposal.proposal_number}`);

//   // Loop through each outlet in the current proposal
//   for (let j = 0; j < proposal.outlets.length; j++) {
//     const outlet = proposal.outlets[j];
//     console.log(`Sending data for Outlet: ${outlet.outlet_name}, Proposal: ${proposal.proposal_number}`);
    
//     // Prepare outlet data to send to external API
//     const outletData = {
//       proposalNumber: proposal.proposal_number,
//       fboName: proposal.fbo_name,
//       outletName: outlet.outlet_name,
//       outletManDays: outlet.man_days,
//       outletType: outlet.type_of_industry,
//       amount: outlet.amount,
//     };

//     console.log(outletData);
//   }
// }
