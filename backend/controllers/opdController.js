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
        medicines,
        visit_date,
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
            medicines,
            visit_date,
            followup_date
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            patient_id,
            doctor_name,
            symptoms,
            diagnosis,
            notes,
            medicines,
            visit_date,
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


// =====================================
// GET UPCOMING FOLLOW-UP APPOINTMENTS
// =====================================
const getUpcomingAppointments = (req, res) => {

    const sql = `
        SELECT
            p.id AS patient_id,
            p.first_name,
            p.last_name,
            p.mobile,
            MIN(DATE(o.followup_date)) AS followup_date
        FROM opd_visits o
        INNER JOIN patients p ON p.id = o.patient_id
        WHERE
            o.followup_date IS NOT NULL
            AND TRIM(o.followup_date) != ''
            AND DATE(o.followup_date) >= DATE('now', 'localtime')
        GROUP BY p.id, p.first_name, p.last_name, p.mobile
        ORDER BY DATE(followup_date) ASC, LOWER(p.first_name) ASC, LOWER(p.last_name) ASC
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




module.exports = {
    addOpdVisit,
    getPatientOpdHistory,
    getUpcomingAppointments
};
