import moment from "moment";
import mongoose from "mongoose";
import Agreement from "../models/agreementModel.js";



export const deleteFields = async (req, res) => {
  try {
    const arrayOfAgreementId = req.body;

    // Validate arrayOfAgreementId if necessary
    if (!Array.isArray(arrayOfAgreementId)) {
      return res
        .status(400)
        .json({ error: "Invalid input: Expected an array of Agreement IDs" });
    }

    // Perform deletions
    const deletionPromises = arrayOfAgreementId.map(async (aggrementId) => {
      // Delete Agreement document
      await Agreement.deleteOne({ _id: aggrementId });
    });

    // Wait for all deletion operations to complete
    await Promise.all(deletionPromises);

    res.status(200).json({ message: "Agreements deleted successfully" });
  } catch (err) {
    console.error("Error deleting aggrements:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const getAllAgreementDetails = async (req, res) => {
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
    let query = Agreement.find();

    // Apply search keyword if provided
    if (keyword) {
      const searchRegex = new RegExp(keyword, "i"); // Case-insensitive regex
      query = query.where("fbo_name").regex(searchRegex);
    }

    // Apply sorting based on the 'sort' parameter
    if (sort === "newest") {
      query = query.sort({ agreement_date: -1 });
    } else if (sort === "oldest") {
      query = query.sort({ agreement_date: 1 });
    }

    // Retrieve agreements with pagination
    const agreements = await query
      .skip((pageNumber - 1) * sizePerPage)
      .limit(sizePerPage)
      .select("fbo_name no_of_outlets agreement_date status"); // Select only the required fields

    // Calculate total outlets and formatted dates for each agreement
    const agreementsWithCounts = agreements.map((agreement) => {
      const totalOutlets = agreement.no_of_outlets;
      const formattedDate = moment(agreement.agreement_date).format(
        "MM/DD/YYYY"
      );

      return {
        _id: agreement._id,
        fbo_name: agreement.fbo_name,
        no_of_outlets: agreement.no_of_outlets,
        agreement_date: formattedDate,
        status: agreement.status,
      };
    });

    // Get the total number of agreements for pagination (this assumes you have a total count somewhere)
    const totalAgreements = await Agreement.countDocuments();

    res.json({
      total: totalAgreements, // Total number of agreements
      currentPage: pageNumber,
      data: agreementsWithCounts,
    });
  } catch (error) {
    console.error("Error fetching agreements:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const createAgreement = async (req, res) => {
  console.log(req.body);
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { fbo_name, from_date, to_date, total_cost, no_of_outlets, address,period,proposalId ,outlets} =
      req.body;


    // Create a new agreement instance with the provided data
    const newAgreement = new Agreement({
      fbo_name,
      address,
      from_date,
      to_date,
      total_cost,
      no_of_outlets,
      period,
      proposalId,
      outlets
    });

    // Save the new agreement to the database
    const savedAgreement = await newAgreement.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    // Send a response with the saved agreement data
    res.status(201).json({
      success: true,
      message: "Agreement created successfully!",
      data: savedAgreement,
    });
  } catch (error) {
    console.error(error);

    // Abort the transaction in case of error
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      success: false,
      message: "Failed to create agreement",
      error: error.message,
    });
  }
};

export const getAgreementById = async (req, res, next) => {
  const { agreementId } = req.params; // Extract the ID from the request parameters

  try {
    // Find the agreement by ID
    const agreement = await Agreement.findById(agreementId);

    // Check if the agreement exists
    if (!agreement) {
      return res.status(404).json({ message: "agreement not found" });
    }

    // Send the agreement data as a response
    res.status(200).json(agreement);
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
};


export const updateAgreement = async (req, res) => {
  console.log(req.body)
  try {
    const { agreementId } = req.params; 
    const { fbo_name, from_date, to_date, total_cost, no_of_outlets, address, period,outlets } =
      req.body;

    // Find the agreement by ID and update it with the provided data
    const updatedAgreement = await Agreement.findByIdAndUpdate(
      agreementId,
      {
        fbo_name,
        address,
        from_date,
        to_date,
        total_cost,
        no_of_outlets,
        period,
        outlets
      },
      { new: true } // Return the updated document
    );

    if (!updatedAgreement) {
      return res.status(404).json({
        success: false,
        message: "Agreement not found",
      });
    }

    // Send a response with the updated agreement data
    res.status(200).json({
      success: true,
      message: "Agreement updated successfully!",
      data: updatedAgreement,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update agreement",
      error: error.message,
    });
  }
};


export const updateAgreementStatus = async (req, res) => {
  console.log("Request Body:", req.body);
  
  const { agreementId } = req.params;  // Extract agreementId from params
  const { status } = req.body;         // Extract status from the request body
  
  try {
    // Validate input
    if (!agreementId || !status) {
      return res
        .status(400)
        .json({ error: "Agreement ID and status are required" });
    }

    // Find and update the agreement
    const updateAgreement = await Agreement.findByIdAndUpdate(
      agreementId,
      { $set: { status, message: "Updated Status" } }, // Update status and message
      { new: true, runValidators: true }               // Return updated document and run validators
    );

    // Check if the agreement was found and updated
    if (!updateAgreement) {
      return res.status(404).json({ error: "Agreement not found" });
    }

    // Send a successful response
    res
      .status(200)
      .json({ message: "Agreement updated successfully", updateAgreement });
    
  } catch (error) {
    // Handle any server errors
    res.status(500).json({ error: "Server error", details: error.message });
  }
};
