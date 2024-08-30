import Setting from "../models/settingModel.js";
import ProfileSetting from "../models/ProfileSettingModel.js";


// Create a new setting
export const createSetting = async (req, res) => {
  try {
    const { proposal_note, invoice_note, proposal_email, invoice_email } = req.body;

    const newSetting = new Setting({
      proposal_note,
      invoice_note,
      proposal_email,
      invoice_email,
    });

    await newSetting.save();

    res.status(201).json(newSetting);
  } catch (error) {
    res.status(500).json({ message: "Failed to create setting", error });
  }
};

// Get all settings
export const getSettings = async (req, res) => {
  try {
    const settings = await Setting.find();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve settings", error });
  }
};

// Get a specific setting by ID
export const getSettingById = async (req, res) => {
  try {
    const { id } = req.params;
    const setting = await Setting.findById(id);

    if (!setting) {
      return res.status(404).json({ message: "Setting not found" });
    }

    res.status(200).json(setting);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve setting", error });
  }
};

// Update a setting by ID
export const updateSetting = async (req, res) => {
  console.log(req.body);
  try {
    const { id } = req.params;
    const { proposal_note, invoice_note, proposal_email, invoice_email,agreement_email,  proposal_cc,invoice_cc, agreement_cc} = req.body;

    const updatedSetting = await Setting.findByIdAndUpdate(
      id,
      {
        proposal_note,
        invoice_note,
        proposal_email,
        invoice_email,
        agreement_email,
        proposal_cc,
        invoice_cc,
        agreement_cc
      },
      { new: true }
    );

    if (!updatedSetting) {
      return res.status(404).json({ message: "Setting not found" });
    }

    res.status(200).json(updatedSetting);
  } catch (error) {
    res.status(500).json({ message: "Failed to update setting", error });
  }
};

// Delete a setting by ID
export const deleteSetting = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSetting = await Setting.findByIdAndDelete(id);

    if (!deletedSetting) {
      return res.status(404).json({ message: "Setting not found" });
    }

    res.status(200).json({ message: "Setting deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete setting", error });
  }
};





export const saveOrUpdateProfile = async (req, res) => {
  try {
    const { company_name, company_address } = req.body;

    // Check if the profile setting already exists
    let profileSetting = await ProfileSetting.findOne();

    if (profileSetting) {
      // If it exists, update the fields
      profileSetting.company_name = company_name;
      profileSetting.company_address = company_address;
    } else {
      // If it doesn't exist, create a new profile setting
      profileSetting = new ProfileSetting({
        company_name,
        company_address,
      });
    }

    // Save the profile setting (either newly created or updated)
    const savedProfile = await profileSetting.save();

    res.status(200).json({ message: "Profile saved/updated successfully", profile: savedProfile });
  } catch (error) {
    res.status(500).json({ message: "Error saving/updating the profile", error });
  }
};


export const getProfileSetting = async (req, res) => {
  try {
    const profileSetting = await ProfileSetting.findOne();

    if (!profileSetting) {
      return res.status(404).json({ message: "Profile setting not found" });
    }

    res.status(200).json({ profile: profileSetting });
  } catch (error) {
    res.status(500).json({ message: "Error fetching the profile setting", error });
  }
};
