import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import {
  saveBusiness,
  getBusinesses,
  saveOutlet,
  getAllBusinessDetails,
  countOutletsForBusinesses,
  deleteFields,
  sendEmail,
  getOutletDetailsById,
  updateBusiness,
  getBusinessDetailsById,
  checkFormId,
  deleteOutlets,
  getParticularOutletDetails,
  updateOutlet,
  getAllClientName,
  getBranchNamesByBusinessId,
} from "../controller/clinetController.js";
const router = express.Router();
 
import { generateQuotation } from "../controller/quotationsController.js";
import { generateInvoices } from "../controller/invoicesController.js";
import { runInContext } from "vm";




router.post("/generate-Quotation", generateQuotation);

router.post("/generate-invoices", generateInvoices);

// Route to save Client data
router.post("/saveClientData", saveBusiness);


// Route to save Client data
router.put("/updateClientData", updateBusiness);

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


//Route to get delete Bussiness details
router.delete("/deleteSelectedFields", deleteFields);

//Route to delete the outlet 
router.delete("/deleteOutletFields", deleteOutlets);

//Route to send the mail
router.post("/sendFormlink", sendEmail);


//Rout to get total outlet
router.get("/getTotalOutlet",countOutletsForBusinesses);

//Route to save outlet
router.post("/saveOutlet", saveOutlet);


//Route to save outlet
router.put("/updateOutlet/:outletId", updateOutlet);

//Route to get Outlet Detail
router.get("/getOutletDetails/:businessId", getOutletDetailsById);

//Route to get particular outelet details
router.get("/getParticularOutletDetails/:id",getParticularOutletDetails);

//Route to get all the client name
router.get("/getAllBussinessName", getAllClientName);


//Route to get all the client name
router.get(
  "/getBranchNamesByBussinessId/:businessId",
  getBranchNamesByBusinessId
);




export default router;
