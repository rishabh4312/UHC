const express = require("express");

const router = express.Router();

const {

    addPatient,
    updatePatient,
    searchPatients,
    getPatientsByStatus

} = require("../controllers/patientController");



router.post("/", addPatient);

router.put("/:id", updatePatient);

router.get("/search", searchPatients);

router.get("/analysis/:status", getPatientsByStatus);



module.exports = router;