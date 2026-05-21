const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
    uploadPrescription,
    uploadLabReport,
    getPrescriptionsByVisit
} = require("../controllers/prescriptionController");


// UPLOAD IMAGE
router.post(
    "/upload",
    upload.single("prescription"),
    uploadPrescription
);

// UPLOAD LAB REPORT
router.post(
    "/upload-lab",
    upload.single("lab_report"),
    uploadLabReport
);


// GET VISIT PRESCRIPTIONS
router.get("/:visitId", getPrescriptionsByVisit);


module.exports = router;