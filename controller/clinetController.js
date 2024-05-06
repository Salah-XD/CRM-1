import Business from "../models/BussinessModel.js";
import Outlet from "../models/outletModel.js";
import PrivateCompany from "../models/privateModel.js";

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
      address,
      added_by,
    } = req.body;

    if (
      !name ||
      !contact_person ||
      !business_type ||
      !phone ||
      !email ||
      !gst_number ||
      !address ||
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
      address,
      added_by,
    });

    // Save the business data to the database
    await newBusiness.save();
    return res
      .status(201)
      .json({ message: "Business data saved successfully", data: newBusiness });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};




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
    let businessId;

    // Extract business ID
    if (business) {
      // Use the provided business ID
      businessId = business;
    } else {
      // Return error if business ID is missing
      return res.status(400).json({ message: "Business ID is required" });
    }

    // Save the outlet, including the branch name
    const newOutlet = new Outlet({
      branch_name, // Include branch name in the outlet data
      business: businessId,
    });
    await newOutlet.save();

    // If the outlet is not owned by a business, save the private company and associate its ObjectId with the outlet
    if (!business_owned) {
      // Save the private company without including branch name
      const privateCompanyData = {
        business: businessId,
        name,
        gst_number,
        address,
        primary_contact_number,
        email,
      };
      const newPrivateCompany = new PrivateCompany(privateCompanyData);
      await newPrivateCompany.save();

      // Associate the ObjectId of the private company with the outlet
      newOutlet.private_company = newPrivateCompany._id;
      await newOutlet.save();
    }

    return res
      .status(201)
      .json({ message: "Outlet saved successfully", data: newOutlet });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



