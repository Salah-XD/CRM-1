import Business from "../models/BussinessModel.js";
import Outlet from "../models/outletModel.js";
import PrivateCompany from "../models/privateModel.js";
import moment from "moment";

// Controller function to handle saving client data
export const saveBusiness = async (req, res) => {
  try {
    const {
      name,
      contact_person,
      business_type,
      fssai_license_number,
      phone,
      email,
      gst_number,
      "address.line1": line1,
      "address.line2": line2,
      "address.city": city,
      "address.state": state,
      "address.pincode": pincode,
      added_by,
    } = req.body;

    if (
      !name ||
      !contact_person ||
      !business_type ||
      !phone ||
      !email ||
      !gst_number ||
      !line1 ||
      !line2 ||
      !city ||
      !state ||
      !pincode ||
      !added_by ||
      !fssai_license_number
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new business instance
    const newBusiness = new Business({
      name,
      contact_person,
      business_type,
      fssai_license_number,
      phone,
      email,
      gst_number,
      address: { line1, line2, city, state, pincode },
      added_by,
    });

    // Save the business data to the database
    await newBusiness.save();
    return res.status(201).send({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


//Save The outlet Information
export const saveOutlet = async (req, res) => {
  try {
    const {
      branch_name,
      business,
      name,
      gst_number,
      address,
      primary_contact_number,
      email,
      business_owned, // Corrected spelling
    } = req.body;

    // Check if business ID is provided
   if (business_owned && !business) {
     return res.status(400).json({ message: "Business ID is required" });
   }

    let newOutlet;

    // If the outlet is owned by a business
    if (business_owned) {
      newOutlet = new Outlet({
        branch_name,
        business,
        private_company: null, // Corrected syntax
      });
    } else {
      // If the outlet is owned by a private company
      newOutlet = new Outlet({
        branch_name,
        business,
      });

      // Save private company data
      const privateCompanyData = {
        name,
        gst_number,
        address,
        primary_contact_number,
        email,
        business,
      };
      const newPrivateCompany = new PrivateCompany(privateCompanyData);
      await newPrivateCompany.save();

      // Associate the ObjectId of the private company with the outlet
      newOutlet.private_company = newPrivateCompany._id;
    }

    // Save the outlet
    await newOutlet.save();

    return res
      .status(201)
      .json({ message: "Outlet saved successfully", data: newOutlet });
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


//Fetch bussiness detail to show in table

export const getAllBusinessDetails = async (req, res) => {
  try {
    const { page, pageSize, sort } = req.query;

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

    let query = Business.find({});

    // Apply sorting based on the 'sort' parameter
    if (sort === "newlyadded") {
      query = query.sort({ created_at: -1 });
    }

    // Count total number of businesses
    const totalBusinesses = await Business.countDocuments();

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
      totalPages: Math.ceil(totalBusinesses / sizePerPage),
      currentPage: pageNumber,
      businesses: businessesWithCountsAndFormattedDate,
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