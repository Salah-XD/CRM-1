import express, { Router } from "express";
import { verifyToken } from "../middleware/auth.js";

import {
  createSetting,
  getSettings,
  getSettingById,
  updateSetting,
  deleteSetting
  } from "../controller/settingController.js";



  

const router = express.Router();


// Create a new setting
router.post("/createSetting", createSetting);

// Get all settings
router.get("/getSettings", getSettings);

// Get a specific setting by ID
router.get("/getSetting/:id", getSettingById);

// Update a setting by ID
router.put("/updateSetting/:id", updateSetting);

// Delete a setting by ID
router.delete("/deleteSetting/:id", deleteSetting);

// 66c41b85dedfff785c08df21

export default router;
