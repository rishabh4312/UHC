const express = require("express");

const router = express.Router();

const {
    addOpdVisit,
    getPatientOpdHistory
} = require("../controllers/opdController");


// ADD OPD VISIT
router.post("/", addOpdVisit);


// GET PATIENT OPD HISTORY
router.get("/:patientId", getPatientOpdHistory);


module.exports = router;