import express from "express";
import {
  createAuditor,
  getAllAuditors,
  getAuditorById,
  updateAuditor,
  deleteAuditor,
  processProposalsWithOutlets,
  getAuditAdmins,
  saveAuditRecord,
  getAudits,
  getAuditById,
  updateAuditById,
  updateStatusHistoryByAuditId,
  saveLabel,addQuestionToLabel,fetchLabelsWithQuestions,saveAuditResponses,updateAuditResponses,fetchingQuestionAnswer
} from "../controller/auditorController.js";

import { v2 as cloudinary } from 'cloudinary';
import { verifyToken } from "../middleware/auth.js";
import multer from "multer";
const upload = multer({ dest: 'uploads/' });


const router = express.Router();

// Public routes
router.post("/createAuditor", createAuditor);

router.get("/getAllAuditors", getAllAuditors);

router.get("/auditors/:id", getAuditorById);

// Protected routes (only for authenticated users)
router.put("/auditors/:id", updateAuditor);

router.delete("/auditors/:id", deleteAuditor);

router.get("/processProposalsWithOutlets", processProposalsWithOutlets);

router.get("/getAuditAdmins", getAuditAdmins);

router.post("/saveAuditRecord", saveAuditRecord);

router.get("/getAllAudits", getAudits);

router.get("/getAuditById/:id", getAuditById);

router.put("/updateAuditById/:id", updateAuditById);

router.put(
  "/updateStatusHistoryByAuditId/:auditId",
  updateStatusHistoryByAuditId
);

// Route to save a new label
router.post('/labels', saveLabel);

// Route to add a question to a label
router.post('/labels/:labelId/questions', addQuestionToLabel);

router.get('/fetchLabelsWithQuestions',fetchLabelsWithQuestions);


router.get('/fetchingQuestionAnswer/:auditId',fetchingQuestionAnswer);


router.post("/saveAuditResponses",upload.array('files'),saveAuditResponses);


router.put("/updateAuditResponses",upload.array('files'),updateAuditResponses);





router.post('/upload', async (req, res) => {
  try {
      const { imageUrl } = req.body; // Expecting image URL to be sent in the request body

      if (!imageUrl) {
          return res.status(400).json({ message: 'No image URL provided' });
      }

      // Upload the image to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(imageUrl, {
          public_id: 'test_image',  // Change this as needed
          folder: 'test_uploads'  // Optional: specify folder in Cloudinary
      });

      // Respond with the uploaded image URL
      res.json({
          message: 'Image uploaded successfully!',
          url: uploadResult.url,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
});


export default router;
