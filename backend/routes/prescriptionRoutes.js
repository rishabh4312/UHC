const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
    uploadPrescription,
    uploadLabReport,
    uploadMedicineBill,
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

// UPLOAD MEDICINE BILL IMAGE
router.post(
    "/upload-bill",
    upload.single("medicine_bill"),
    uploadMedicineBill
);


// GET VISIT PRESCRIPTIONS
router.get("/:visitId", getPrescriptionsByVisit);


module.exports = router;