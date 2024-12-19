import express, { Router } from "express";
import { verifyToken } from "../middleware/auth.js";

import {
  createSetting,
  getSettings,
  getSettingById,
  updateSetting,
  deleteSetting,
  saveOrUpdateProfile,
  getProfileSetting
} from "../controller/settingController.js";

const router = express.Router();

// Create a new setting
router.post("/createSetting", verifyToken, createSetting);

// Get all settings
router.get("/getSettings", verifyToken, getSettings);

// Get a specific setting by ID
router.get("/getSetting/:id", verifyToken, getSettingById);

// Update a setting by ID
router.put("/updateSetting/:id", verifyToken, updateSetting);

// Delete a setting by ID
router.delete("/deleteSetting/:id", verifyToken, deleteSetting);

// Save or update profile settings
router.post("/saveOrUpdateProfile", verifyToken, saveOrUpdateProfile);

// Get profile settings
router.get("/getProfileSetting", verifyToken, getProfileSetting);

export default router;
