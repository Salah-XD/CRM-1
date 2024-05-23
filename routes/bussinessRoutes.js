import express from "express";

import {
  saveBusiness,
  getBusinesses,
  saveOutlet,
  getAllBusinessDetails,
  countOutletsForBusinesses,
  deleteFields,
  sendEmail,
  getOutletDetails,
  updateBusiness,
  getBusinessDetailsById,
  checkFormId,
} from "../controller/clinetController.js";
const router = express.Router();
 


// Route to save Client data
router.post("/saveClientData", saveBusiness);


// Route to save Client data
router.post("/updateClientData", updateBusiness);

//Route to get the bussiness name
router.get("/getAllBussinessName", getBusinesses);

//Route to get all Bussiness deatils
router.get("/getAllBussinesDetails", getAllBusinessDetails);


// Define the route to check if a form_id exists
router.get('/checkFormId/:formId', checkFormId);


// Route to fetch business details by form ID
router.get("/getBusinessDataByFormId/:formId", getBusinessDetailsById);

// Route to fetch business details by ID
router.get("/getBusinessDataById/:id", getBusinessDetailsById);


//Route to get all Bussiness deatils
router.delete("/deleteSelectedFields", deleteFields);

//Route to send the mail
router.post("/sendFormlink", sendEmail);


//Rout to get total outlet
router.get("/getTotalOutlet",countOutletsForBusinesses);

//Route to save outlet
router.post("/saveOutlet", saveOutlet);

//Route to get Outlet Detail
router.get("/getOutletDetails", getOutletDetails);





export default router;
