import moment from "moment";
import Business from "../models/bussinessModel.js";
import Outlet from "../models/outletModel.js";
import PrivateCompany from "../models/privateModel.js";
import nodemailer from "nodemailer";
import mongoose from "mongoose";

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
      status: "approved", // Set status to "approved" for a new form
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

//Save The outlet Information
export const saveOutlet = async (req, res) => {
  console.log(req.body);
  try {
    const {
      branch_name,
      business,
      gst_number,
      contact_number,
      private_owned,
    } = req.body;

    // Check if branch_name, private_owned, and business are provided and have valid values
    if (
      !branch_name ||
      !private_owned ||
      !["yes", "no"].includes(private_owned)
    ) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // Check if business ID is provided when the outlet is privately owned
    if (private_owned === "yes" && !business) {
      return res.status(400).json({
        message: "Business ID is required when the outlet is privately owned",
      });
    }

    let newOutlet;

    // If the outlet is not privately owned
    if (private_owned === "no") {
      newOutlet = new Outlet({
        branch_name,
        business,
        private_company: null, // Optional field for outlets not owned by private companies
      });
    } else {
      // If the outlet is privately owned
      // Create a new private company document
      const privateCompanyData = {
        fssai_license_number: req.body.fssai_license_number,
        no_of_food_handlers: req.body.no_of_food_handlers,
        Vertical_of_industry: req.body.Vertical_of_industry,
        contact_number,
        contact_person: req.body.contact_person,
        gst_number,
        business,
      };
      const newPrivateCompany = new PrivateCompany(privateCompanyData);

      // Save the new private company document
      await newPrivateCompany.save();

      // Create a new outlet document linked to the private company
      newOutlet = new Outlet({
        branch_name,
        business,
        private_company: newPrivateCompany._id,
      });
    }

    // Save the new outlet document
    await newOutlet.save();

    return res
      .status(201)
      .json({ message: "Outlet saved successfully", data: newOutlet });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update The outlet Information
export const updateOutlet = async (req, res) => {
  console.log(req.body);
  try {
    const { outletId } = req.params;
    const {
      branch_name,
      business,
      gst_number,
      contact_number,
      private_owned,
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
    if (branch_name) {
      outlet.branch_name = branch_name;
    }
    if (private_owned) {
      // Check if private_owned has a valid value
      if (!["yes", "no"].includes(private_owned)) {
        return res
          .status(400)
          .json({ message: "Invalid value for private_owned" });
      }
      outlet.private_owned = private_owned;

      if (private_owned === "yes") {
        if (business) {
          outlet.business = business;
        }

        // Find or create private company data
        let privateCompany;
        if (outlet.private_company) {
          privateCompany = await PrivateCompany.findById(
            outlet.private_company
          );
          if (!privateCompany) {
            return res
              .status(404)
              .json({ message: "Associated private company not found" });
          }
        } else {
          privateCompany = new PrivateCompany();
        }

        // Update private company data

        if (gst_number) {
          privateCompany.gst_number = gst_number;
        }

        if (contact_number) {
          privateCompany.contact_number = contact_number;
        }
        if (business) {
          privateCompany.business = business;
        }
        if (fssai_license_number) {
          privateCompany.fssai_license_number = fssai_license_number;
        }
        if (no_of_food_handlers) {
          privateCompany.no_of_food_handlers = no_of_food_handlers;
        }
        if (Vertical_of_industry) {
          privateCompany.Vertical_of_industry = Vertical_of_industry;
        }

        await privateCompany.save();

        // Associate the ObjectId of the private company with the outlet
        outlet.private_company = privateCompany._id;
      } else {
        outlet.business = business;
        outlet.private_company = null;
      }
    } else {
      if (business) {
        outlet.business = business;
      }
    }

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

    // Base query
    let query = Business.find({});

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
  try {
    const arrayOfBusinessIds = req.body; // Assuming an array of business IDs is sent in the request body

    // Validate arrayOfBusinessIds here if necessary

    const deletionPromises = arrayOfBusinessIds.map(async (businessId) => {
      // Find all outlets linked to this business
      const outlets = await Outlet.find({ business: businessId });

      // Extract private company IDs from outlets
      const privateCompanyIds = outlets
        .filter((outlet) => outlet.private_company) // Filter only outlets with a private_company
        .map((outlet) => outlet.private_company);

      // Delete associated PrivateCompany documents first, if any
      if (privateCompanyIds.length > 0) {
        await PrivateCompany.deleteMany({ _id: { $in: privateCompanyIds } });
      }

      // Delete all outlets where business ID matches
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
    page = parseInt(page, 10);
    pageSize = parseInt(pageSize, 10);
    if (isNaN(page) || page <= 0) {
      page = 1;
    }
    if (isNaN(pageSize) || pageSize <= 0) {
      pageSize = 10;
    }
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
      .populate("private_company")
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

    const populatedData = [];

    for (const outlet of outlets) {
      let data;

      if (outlet.private_company) {
        // If private_company is not null, extract data from Private model
        const privateCompany = outlet.private_company;
        data = {
          _id: outlet._id, // Include outlet ID
          outlet_name: outlet.branch_name,
          fssai_license_number: privateCompany.fssai_license_number,
          contact_number: privateCompany.contact_number,
          contact_person: privateCompany.contact_person,
          no_of_food_handlers: privateCompany.no_of_food_handlers,
          Vertical_of_industry: privateCompany.Vertical_of_industry,
          gst_number: privateCompany.gst_number,
        };
      } else if (outlet.business) {
        // If business is not null, extract data from Business model
        const business = outlet.business;
        data = {
          _id: outlet._id, // Include outlet ID
          outlet_name: outlet.branch_name,
          fssai_license_number: business.fssai_license_number,
          no_of_food_handlers: business.no_of_food_handlers,
          Vertical_of_industry: business.Vertical_of_industry,
          gst_number: business.gst_number,
          contact_number: business.phone,
          contact_person: business.contact_person,
        };
      }

      // Add extracted data to the populatedData array
      if (data) populatedData.push(data);
    }

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
  console.log("Request body:", req.body);
  try {
    const arrayOfOutletIds = req.body; // Assuming an array of arrays of IDs is sent in the request body

    // Validate the arrayOfOutletIds here if necessary

    // Assuming Outlet is your Mongoose model
    const deletionPromises = arrayOfOutletIds.map(async (outletIds) => {
      const outlets = await Outlet.find({ _id: { $in: outletIds } });

      // Iterate through each outlet and handle deletion
      for (const outlet of outlets) {
        if (outlet.private_company) {
          // Delete the private data first if it exists
          await PrivateCompany.deleteOne({ _id: outlet.private_company });
        }
        // Delete the outlet
        await Outlet.deleteOne({ _id: outlet._id });
      }
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
  console.log(req.params.id);
  try {
    const outletId = req.params.id;

    // Find the outlet by ID and populate business and private_company references
    const outlet = await Outlet.findById(outletId)
      .populate("business")
      .populate("private_company");

    if (!outlet) {
      return res.status(404).json({ error: "Outlet not found" });
    }

    const response = {
      branch_name: outlet.branch_name,
      private_owned: !!outlet.private_company,
    };

    if (outlet.private_company) {
      response.private_details = outlet.private_company;
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
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
