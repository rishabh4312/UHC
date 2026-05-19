const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
    uploadPrescription,
    getPrescriptionsByVisit
} = require("../controllers/prescriptionController");


// UPLOAD IMAGE
router.post(
    "/upload",
    upload.single("prescription"),
    uploadPrescription
);


// GET VISIT PRESCRIPTIONS
router.get("/:visitId", getPrescriptionsByVisit);


module.exports = router;