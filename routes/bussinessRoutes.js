import express from "express";

import {
  saveBusiness,
  
  saveOutlet
} from "../controller/clinetController.js";
const router = express.Router();
 


// Route to save Client data
router.post("/saveClientData", saveBusiness);



router.post("/saveOutlet", saveOutlet);





export default router;
