import express, { Router } from "express";
import { verifyToken } from "../middleware/auth.js";

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
  deleteOutlets,
  getParticularOutletDetails,
  updateOutlet,
  getBranchNamesByBusinessId,
  getAllClientDetails,
  updateBusinessStatus,
} from "../controller/clinetController.js";
const router = express.Router();
 

// import { generateInvoices } from "../controller/invoicesController.js";






// router.post("/generate-invoices", generateInvoices);

// Route to save Client data
router.post("/saveClientData", saveBusiness);


// Route to save Client data
router.put("/updateClientData", updateBusiness);

//Route to get the bussiness name
router.get("/getAllBussinessName",getBusinesses);

//Route to get all Bussiness deatils
router.get("/getAllBussinesDetails", getAllBusinessDetails);





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


//Route to get total outlet
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
router.get(
  "/getBranchNamesByBussinessId/:businessId",
  getBranchNamesByBusinessId
);


router.get("/getAllClientDetail", getAllClientDetails);


router.put("/updateBusinessStatus/:id", updateBusinessStatus);


export default router;
