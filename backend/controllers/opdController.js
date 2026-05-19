const db = require("../database/db");


// =====================================
// ADD OPD VISIT
// =====================================
const addOpdVisit = (req, res) => {

    const {
        patient_id,
        doctor_name,
        symptoms,
        diagnosis,
        notes,
        followup_date
    } = req.body;

    if (!patient_id) {

        return res.status(400).json({
            success: false,
            message: "Patient ID required"
        });
    }

    const sql = `
        INSERT INTO opd_visits (
            patient_id,
            doctor_name,
            symptoms,
            diagnosis,
            notes,
            followup_date
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            patient_id,
            doctor_name,
            symptoms,
            diagnosis,
            notes,
            followup_date
        ],
        function(err) {

            if (err) {

                console.log(err.message);

                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            res.status(201).json({
                success: true,
                message: "OPD visit added successfully",
                visit_id: this.lastID
            });
        }
    );
};




// =====================================
// GET OPD HISTORY BY PATIENT
// =====================================
const getPatientOpdHistory = (req, res) => {

    const patientId = req.params.patientId;

    const sql = `
        SELECT *
        FROM opd_visits
        WHERE patient_id = ?
        ORDER BY visit_date DESC
    `;

    db.all(sql, [patientId], (err, rows) => {

        if (err) {

            console.log(err.message);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        res.json({
            success: true,
            data: rows
        });
    });
};




module.exports = {
    addOpdVisit,
    getPatientOpdHistory
};