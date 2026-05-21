const express = require("express");

const router = express.Router();

const {
    addOpdVisit,
    getPatientOpdHistory,
    getUpcomingAppointments
} = require("../controllers/opdController");


// ADD OPD VISIT
router.post("/", addOpdVisit);


// GET UPCOMING FOLLOW-UP APPOINTMENTS
router.get("/upcoming", getUpcomingAppointments);


// GET PATIENT OPD HISTORY
router.get("/:patientId", getPatientOpdHistory);


module.exports = router;
