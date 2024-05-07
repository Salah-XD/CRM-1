import express from "express";

import {
  saveBusiness,
  getBusinesses,
  saveOutlet,
  getAllBusinessDetails,
  countOutletsForBusinesses,
} from "../controller/clinetController.js";
const router = express.Router();
 


// Route to save Client data
router.post("/saveClientData", saveBusiness);

//Route to get the bussiness name
router.get("/getAllBussinessName", getBusinesses);

//Route to get all Bussiness deatils
router.get("/getAllBussinesDetails", getAllBusinessDetails);


//Rout to get total outlet
router.get("/getTotalOutlet",countOutletsForBusinesses)

//Route to save outlet
router.post("/saveOutlet", saveOutlet);





export default router;
