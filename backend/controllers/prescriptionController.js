const db = require("../database/db");


// =====================================
// UPLOAD PRESCRIPTION IMAGE
// =====================================
const uploadPrescription = (req, res) => {

    try {

        const {
            patient_id,
            visit_id
        } = req.body;


        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "No image uploaded"
            });
        }


        const imagePath = req.file.path;


        const sql = `
            INSERT INTO prescription_images (
                patient_id,
                visit_id,
                image_path
            )
            VALUES (?, ?, ?)
        `;


        db.run(
            sql,
            [
                patient_id,
                visit_id,
                imagePath
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
                    message: "Prescription uploaded successfully",
                    image_id: this.lastID,
                    image_path: imagePath
                });
            }
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};




// =====================================
// GET PRESCRIPTIONS BY VISIT
// =====================================
const getPrescriptionsByVisit = (req, res) => {

    const visitId = req.params.visitId;

    const sql = `
        SELECT *
        FROM prescription_images
        WHERE visit_id = ?
        ORDER BY uploaded_at DESC
    `;

    db.all(sql, [visitId], (err, rows) => {

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




const uploadLabReport = (req, res) => {

    try {

        const {
            patient_id,
            visit_id
        } = req.body;

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "No lab report uploaded"
            });
        }

        const imagePath = req.file.path;

        const sql = `
            UPDATE opd_visits
            SET lab_report = ?
            WHERE id = ?
        `;

        db.run(
            sql,
            [
                imagePath,
                visit_id
            ],
            function(err) {

                if (err) {

                    console.log(err.message);

                    return res.status(500).json({
                        success: false,
                        message: "Database error"
                    });
                }

                res.status(200).json({
                    success: true,
                    message: "Lab report uploaded successfully",
                    image_path: imagePath
                });
            }
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    uploadPrescription,
    uploadLabReport,
    getPrescriptionsByVisit
};