import moment from "moment";
import Business from "../models/bussinessModel.js";
import Outlet from "../models/outletModel.js";
import PrivateCompany from "../models/privateModel.js";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import Enquiry from "../models/enquiryModel.js"

// Controller function to handle saving client data
export const saveBusiness = async (req, res) => {
  console.log(req.body);
  try {
    const {
      name,
      contact_person,
      type_of_industry,
      Vertical_of_industry,
      fssai_license_number,
      phone,
      email,
      gst_number,
      address,
      added_by,
      status,
    } = req.body;

    // Validate required fields
    if (!name || !contact_person || !email || !phone) {
      return res.status(400).json({
        message: "Name, Contact Person, Email, and Phone are required",
      });
    }

    // Create a new business instance
    const newBusiness = new Business({
      name,
      contact_person,
      type_of_industry,
      Vertical_of_industry,
      fssai_license_number,
      phone,
      email,
      gst_number,
      address, // Directly use the address object from req.body
      added_by,
      status, // Set status to "approved" for a new form
      created_at: new Date(), // Record creation timestamp
    });

    // Save the new form to the database
    await newBusiness.save();

    return res.status(201).send({ success: true, data: newBusiness });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Controller function to handle update of client data
export const updateBusiness = async (req, res) => {
  try {
    const {
      _id,
      name,
      contact_person,
      type_of_industry,
      Vertical_of_industry,
      fssai_license_number,
      phone,
      email,
      gst_number,
      "address.line1": line1,
      "address.line2": line2,
      "address.city": city,
      "address.state": state,
      "address.pincode": pincode,
      updated_by,
    } = req.body;

    // Validate required fields
    if (!_id) {
      return res.status(400).json({
        message: "id is required",
      });
    }

    // Check if the business exists
    const existingBusiness = await Business.findById(_id);
    if (!existingBusiness) {
      return res.status(404).json({ message: "Business not found" });
    }

    // Update business fields
    existingBusiness.name = name;
    existingBusiness.contact_person = contact_person;
    existingBusiness.type_of_industry = type_of_industry;
    existingBusiness.Vertical_of_industry = Vertical_of_industry;
    existingBusiness.fssai_license_number = fssai_license_number;
    existingBusiness.phone = phone;
    existingBusiness.email = email;
    existingBusiness.gst_number = gst_number;
    existingBusiness.address = { line1, line2, city, state, pincode };
    existingBusiness.updated_by = updated_by;
    existingBusiness.updated_at = new Date(); // Record update timestamp

    // Save the updated business to the database
    await existingBusiness.save();

    return res.status(200).send({ success: true, data: existingBusiness });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to fetch business details by form ID or ID
export const getBusinessDetailsById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    // Fetch business details by ID
    const business = await Business.findById(id);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.status(200).json({ success: true, data: business });
  } catch (error) {
    console.error("Error fetching business details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to save outlet information
export const saveOutlet = async (req, res) => {
  try {
    const {
      branch_name,
      contact_number,
      contact_person,
      no_of_food_handlers,
      fssai_license_number,
      gst_number,
      business,
    } = req.body;

    // Create a new outlet instance with the provided data
    const newOutlet = new Outlet({
      branch_name,
      contact_number,
      contact_person,
      no_of_food_handlers,
      fssai_license_number,
      gst_number,
      business,
    });

    // Save the outlet to the database
    await newOutlet.save();

    res.status(201).json({ message: "Outlet data saved successfully" });
  } catch (error) {
    console.error("Error saving outlet data:", error);
    res
      .status(500)
      .json({ message: "Failed to save outlet data. Please try again later." });
  }
};
// Update The outlet Information
export const updateOutlet = async (req, res) => {

  try {
    const { outletId } = req.params;
    const {
      branch_name,
      business,
      gst_number,
      contact_number,
      fssai_license_number,
      no_of_food_handlers,
      Vertical_of_industry,
    } = req.body;

    // Check if outletId is provided
    if (!outletId) {
      return res.status(400).json({ message: "Outlet ID is required" });
    }

    // Find the outlet by ID
    const outlet = await Outlet.findById(outletId);
    if (!outlet) {
      return res.status(404).json({ message: "Outlet not found" });
    }

    // Update the fields that are provided
    if (branch_name) outlet.branch_name = branch_name;
    if (business) outlet.business = business;
    if (gst_number) outlet.gst_number = gst_number;
    if (contact_number) outlet.contact_number = contact_number;
    if (fssai_license_number)
      outlet.fssai_license_number = fssai_license_number;
    if (no_of_food_handlers) outlet.no_of_food_handlers = no_of_food_handlers;
    if (Vertical_of_industry)
      outlet.Vertical_of_industry = Vertical_of_industry;

    // Save the outlet
    await outlet.save();

    return res
      .status(200)
      .json({ message: "Outlet updated successfully", data: outlet });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



//Fetch Bussiness name to show in outlets
export const getBusinesses = async (req, res) => {
  try {
    const businesses = await Business.find({}, "_id name");
    return res.status(200).json({ businesses });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllBusinessDetails = async (req, res) => {
  try {
    const { page, pageSize, sort, keyword } = req.query;

    // Convert page and pageSize to integers
    const pageNumber = parseInt(page);
    const sizePerPage = parseInt(pageSize);

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

    // Base query with status condition
    let query = Business.find({
      status: "approved", // Filter for businesses with status "pending"
    });

    // Apply search keyword if provided
    if (keyword) {
      const searchRegex = new RegExp(keyword, "i"); // Case-insensitive regex
      query = query.or([
        { name: searchRegex },
        { contact_person: searchRegex },
        { phone: searchRegex },
        { email: searchRegex },
      ]);
    }

    // Apply sorting based on the 'sort' parameter
    if (sort === "newlyadded") {
      query = query.sort({ created_at: -1 });
    }

    // Count total number of businesses
    const totalBusinesses = await Business.countDocuments(query.getQuery());

    // Retrieve businesses with pagination
    const businesses = await query
      .skip((pageNumber - 1) * sizePerPage)
      .limit(sizePerPage)
      .select(
        "-address -business_type -fssai_license_number -gst_number -updated_at"
      );

    // Retrieve outlet counts for each business
    const businessIds = businesses.map((business) => business._id);
    const outletCounts = await Outlet.aggregate([
      { $match: { business: { $in: businessIds } } },
      { $group: { _id: "$business", count: { $sum: 1 } } },
    ]);

    // Combine business data with outlet counts and format created_at field
    const businessesWithCountsAndFormattedDate = businesses.map((business) => {
      const outletCount = outletCounts.find((count) =>
        count._id.equals(business._id)
      );
      const formattedCreatedAt = moment(business.created_at).fromNow(); // Format created_at using Moment.js
      return {
        ...business.toObject(),
        outletCount: outletCount ? outletCount.count : 0,
        created_at: formattedCreatedAt, // Update created_at with formatted date
      };
    });

    res.json({
      total: totalBusinesses, // Total number of businesses
      currentPage: pageNumber,
      data: businessesWithCountsAndFormattedDate,
    });
  } catch (error) {
    console.error("Error fetching businesses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const countOutletsForBusinesses = async (req, res) => {
  try {
    // Aggregate outlets to count the number of outlets for each business
    const outletCountsByBusiness = await Outlet.aggregate([
      {
        $group: {
          _id: "$business", // Group by business ID
          count: { $sum: 1 }, // Count the number of outlets in each group
        },
      },
    ]);

    // Respond with the outlet counts for each business
    res.json(outletCountsByBusiness);
  } catch (error) {
    console.error("Error counting outlets for businesses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteFields = async (req, res) => {
  //console.log(req.body);
  try {
    const arrayOfBusinessIds = req.body; 

    // Validate arrayOfBusinessIds here if necessary

    const deletionPromises = arrayOfBusinessIds.map(async (businessId) => {
      // Delete all outlets linked to this business
      await Outlet.deleteMany({ business: businessId });

      // Delete Business document
      await Business.deleteOne({ _id: businessId });
    });

    // Wait for all deletion operations to complete
    await Promise.all(deletionPromises);

    res.status(200).json({ message: "Fields deleted successfully" });
  } catch (err) {
    console.error("Error deleting fields:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Controller to send logic to
export const sendEmail = async (req, res) => {
  // console.log(req.body);
  const { to, message, formLink } = req.body;

  try {
    if (!to || !message || !formLink) {
      throw new Error("Missing parameters");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `<${process.env.EMAIL_USERNAME}>`,
      to,
      subject: "Client Onboarding Form",
      text: `${message}\n\nClient Onboarding Form: ${formLink}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};

export const getOutletDetailsById = async (req, res) => {
  try {
    const { businessId } = req.params;
    let { page, pageSize, sort } = req.query;

    // Convert page and pageSize to numbers and validate
    page = parseInt(page, 10) || 1;
    pageSize = parseInt(pageSize, 10) || 10;
    const skip = (page - 1) * pageSize;

    // Check if businessId exists
    const businessExists = await Business.exists({ _id: businessId });
    if (!businessExists) {
      console.log("Business not found");
      return res.status(404).json({ message: "Business not found" });
    }

    // Find the total count of outlets with the specified business ID
    const totalOutlets = await Outlet.countDocuments({ business: businessId });
    console.log(`Total outlets found: ${totalOutlets}`);

    // Initialize query with pagination
    let query = Outlet.find({ business: businessId })
      .populate("business")
      .skip(skip)
      .limit(pageSize);

    // Apply sorting based on the 'sort' parameter
    if (sort === "newlyadded") {
      query = query.sort({ created_at: -1 });
    }

    // Execute the query to get outlets
    const outlets = await query;

    console.log(`Found ${outlets.length} outlets`);

    if (!outlets.length) {
      return res.status(200).json({
        message: "No outlets found",
        data: [],
        total: totalOutlets,
        currentPage: page,
        pageSize: pageSize,
      });
    }

    const populatedData = outlets.map((outlet) => ({
      _id: outlet._id, // Include outlet ID
      outlet_name: outlet.branch_name,
      fssai_license_number: outlet.fssai_license_number,
      contact_number: outlet.contact_number,
      contact_person: outlet.contact_person,
      no_of_food_handlers: outlet.no_of_food_handlers,
      gst_number: outlet.gst_number,
    }));

    console.log(`Populated data: ${JSON.stringify(populatedData)}`);

    return res.status(200).json({
      message: "Data populated successfully",
      data: populatedData,
      total: totalOutlets,
      currentPage: page,
      pageSize: pageSize,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


//Controller to deltet the array of fields of outlet
export const deleteOutlets = async (req, res) => {
  
  try {
    const arrayOfOutletIds = req.body; // Assuming an array of arrays of IDs is sent in the request body

    // Validate the arrayOfOutletIds here if necessary

    // Assuming Outlet is your Mongoose model
    const deletionPromises = arrayOfOutletIds.map(async (outletIds) => {
      // Delete outlets by their IDs
      return Outlet.deleteMany({ _id: { $in: outletIds } });
    });

    // Wait for all deletion operations to complete
    await Promise.all(deletionPromises);

    res.status(200).json({ message: "Outlets deleted successfully" });
  } catch (err) {
    console.error("Error deleting outlets:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getParticularOutletDetails = async (req, res) => {
  const outletId = req.params.id;

  try {
    // Find the outlet by ID without populating other references
    const outlet = await Outlet.findById(outletId);

    if (!outlet) {
      return res.status(404).json({ error: "Outlet not found" });
    }

    const response = {
      branch_name: outlet.branch_name,
      outlet_id: outlet._id,
      fssai_license_number: outlet.fssai_license_number,
      contact_number: outlet.contact_number,
      contact_person: outlet.contact_person,
      no_of_food_handlers: outlet.no_of_food_handlers,
      gst_number: outlet.gst_number,
    };

    // Include private company details if applicable
    if (outlet.private_company) {
      response.private_details = outlet.private_company;
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


//Controller to get all the client name
export const getAllClientName = async (req, res) => {
  try {
    // Fetch all client names and their IDs from the Business model
    const clientNameList = await Business.find({}, "name _id").exec();

    // Extract client names and IDs from the query result
    const clients = clientNameList.map((business) => ({
      id: business._id,
      name: business.name,
    }));

    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while fetching client names",
      error,
    });
  }
};

//Outlet to get the branch name from Outlet Model by specific bussiness id

export const getBranchNamesByBusinessId = async (req, res) => {
  const { businessId } = req.params;

  try {
    console.log(`Fetching branch names for business ID: ${businessId}`);

    // Ensure businessId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      return res.status(400).json({ message: "Invalid business ID" });
    }

    // Fetch branch names and outlet IDs from the Outlet model for the specific business ID
    const branchList = await Outlet.find(
      { business: businessId },
      { _id: 1, branch_name: 1 } // Projection to retrieve only outlet ID and branch name
    ).exec();

    console.log("Branches found:", branchList);

    // Extract branch names and outlet IDs from the query result
    const branches = branchList.map((outlet) => ({
      _id: outlet._id,
      branchName: outlet.branch_name,
    }));

    res.status(200).json(branches);
  } catch (error) {
    console.error("Error fetching branches:", error);
    res.status(500).json({
      message: "An error occurred while fetching branches",
      error,
    });
  }
};

//check client onboarding approved or not
export const getAllClientDetails = async (req, res) => {
  try {
    const { page, pageSize, sort, keyword } = req.query;

    // Convert page and pageSize to integers
    const pageNumber = parseInt(page);
    const sizePerPage = parseInt(pageSize);

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

    // Base query with added conditions
    let query = Business.find({
      added_by: "Client Form",
      status: "pending", 
    });

    // Apply search keyword if provided
    if (keyword) {
      const searchRegex = new RegExp(keyword, "i"); // Case-insensitive regex
      query = query.or([
        { name: searchRegex },
        { contact_person: searchRegex },
        { phone: searchRegex },
        { email: searchRegex },
      ]);
    }

    // Apply sorting based on the 'sort' parameter
    if (sort === "newlyadded") {
      query = query.sort({ created_at: -1 });
    }

    // Count total number of businesses
    const totalBusinesses = await Business.countDocuments(query.getQuery());

    // Retrieve businesses with pagination
    const businesses = await query
      .skip((pageNumber - 1) * sizePerPage)
      .limit(sizePerPage)
      .select(
        "-address -business_type -fssai_license_number -gst_number -updated_at"
      );

    // Retrieve outlet counts for each business
    const businessIds = businesses.map((business) => business._id);
    const outletCounts = await Outlet.aggregate([
      { $match: { business: { $in: businessIds } } },
      { $group: { _id: "$business", count: { $sum: 1 } } },
    ]);

    // Combine business data with outlet counts and format created_at field
    const businessesWithCountsAndFormattedDate = businesses.map((business) => {
      const outletCount = outletCounts.find((count) =>
        count._id.equals(business._id)
      );
      const formattedCreatedAt = moment(business.created_at).fromNow(); // Format created_at using Moment.js
      return {
        ...business.toObject(),
        outletCount: outletCount ? outletCount.count : 0,
        created_at: formattedCreatedAt, // Update created_at with formatted date
      };
    });

    res.json({
      total: totalBusinesses, // Total number of businesses
      currentPage: pageNumber,
      data: businessesWithCountsAndFormattedDate,
    });
  } catch (error) {
    console.error("Error fetching businesses:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const updateBusinessStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedBusiness = await Business.findByIdAndUpdate(
      id,
      { status: "approved" }, // Set the status to 'approved'
      { new: true } // Return the updated document
    );

    if (!updatedBusiness) {
      return res.status(404).json({ message: "Business not found" });
    }

    return res.status(200).json(updatedBusiness);
  } catch (error) {
    console.error("Error updating business status:", error);
    return res.status(500).json({ message: "Server error" });
  }
};