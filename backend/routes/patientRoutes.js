const express = require("express");

const router = express.Router();

const {
    addPatient,
    getAllPatients,
    getPatientById,
    deletePatient
} = require("../controllers/patientController");


// ADD PATIENT
router.post("/", addPatient);


// GET ALL PATIENTS
router.get("/", getAllPatients);


// GET SINGLE PATIENT
router.get("/:id", getPatientById);


// DELETE PATIENT
router.delete("/:id", deletePatient);


module.exports = router;