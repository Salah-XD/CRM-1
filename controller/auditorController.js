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
