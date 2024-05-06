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



