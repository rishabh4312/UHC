const db = require("../database/db");


// =====================================
// ADD NEW PATIENT
// =====================================
const addPatient = (req, res) => {

    const {
        full_name,
        mobile,
        age,
        gender,
        address
    } = req.body;

    // Validation
    if (!full_name) {
        return res.status(400).json({
            success: false,
            message: "Full name is required"
        });
    }

    const sql = `
        INSERT INTO patients (
            full_name,
            mobile,
            age,
            gender,
            address
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [full_name, mobile, age, gender, address],
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
                message: "Patient added successfully",
                patient_id: this.lastID
            });
        }
    );
};




// =====================================
// GET ALL PATIENTS
// =====================================
const getAllPatients = (req, res) => {

    const sql = `
        SELECT *
        FROM patients
        ORDER BY id DESC
    `;

    db.all(sql, [], (err, rows) => {

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




// =====================================
// GET SINGLE PATIENT
// =====================================
const getPatientById = (req, res) => {

    const patientId = req.params.id;

    const sql = `
        SELECT *
        FROM patients
        WHERE id = ?
    `;

    db.get(sql, [patientId], (err, row) => {

        if (err) {
            console.log(err.message);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (!row) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        res.json({
            success: true,
            data: row
        });
    });
};




// =====================================
// DELETE PATIENT
// =====================================
const deletePatient = (req, res) => {

    const patientId = req.params.id;

    const sql = `
        DELETE FROM patients
        WHERE id = ?
    `;

    db.run(sql, [patientId], function(err) {

        if (err) {
            console.log(err.message);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        res.json({
            success: true,
            message: "Patient deleted successfully"
        });
    });
};




module.exports = {
    addPatient,
    getAllPatients,
    getPatientById,
    deletePatient
};