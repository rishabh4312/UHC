const db = require("../database/db");



// =====================================
// ADD PATIENT
// =====================================
const addPatient = (req, res) => {

    const {

        first_name,
        last_name,
        mobile,
        age,
        gender,
        address,
        treatment_start_date,
        treatment_end_date

    } = req.body;



    const treatment_status =
        treatment_end_date
            ? "COMPLETED"
            : "UNDER_TREATMENT";



    const duplicateSql = `
        SELECT *
        FROM patients
        WHERE

            LOWER(first_name)=LOWER(?)

            AND

            LOWER(last_name)=LOWER(?)

            AND

            mobile=?
    `;



    db.get(
        duplicateSql,
        [
            first_name,
            last_name,
            mobile
        ],
        (err, existingPatient) => {

            if (existingPatient) {

                return res.status(409).json({

                    success: false,

                    alreadyExists: true,

                    patient: existingPatient
                });
            }



            const sql = `
                INSERT INTO patients (

                    first_name,
                    last_name,
                    mobile,
                    age,
                    gender,
                    address,
                    treatment_start_date,
                    treatment_end_date,
                    treatment_status

                )

                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;



            db.run(
                sql,
                [

                    first_name,
                    last_name,
                    mobile,
                    age,
                    gender,
                    address,
                    treatment_start_date,
                    treatment_end_date,
                    treatment_status

                ],
                function(err) {

                    if (err) {

                        return res.status(500).json({

                            success: false,

                            message: err.message
                        });
                    }



                    res.json({

                        success: true,

                        patient_id: this.lastID
                    });
                }
            );
        }
    );
};




// =====================================
// UPDATE PATIENT
// =====================================
const updatePatient = (req, res) => {

    const patientId = req.params.id;

    const {

        first_name,
        last_name,
        mobile,
        age,
        gender,
        address,
        treatment_start_date,
        treatment_end_date

    } = req.body;



    const treatment_status =
        treatment_end_date
            ? "COMPLETED"
            : "UNDER_TREATMENT";



    const duplicateSql = `
        SELECT *
        FROM patients
        WHERE

            LOWER(first_name)=LOWER(?)

            AND

            LOWER(last_name)=LOWER(?)

            AND

            mobile=?

            AND

            id != ?
    `;



    db.get(
        duplicateSql,
        [
            first_name,
            last_name,
            mobile,
            patientId
        ],
        (err, existingPatient) => {

            if (existingPatient) {

                return res.status(409).json({

                    success: false,

                    alreadyExists: true
                });
            }



            const sql = `
                UPDATE patients
                SET

                    first_name=?,
                    last_name=?,
                    mobile=?,
                    age=?,
                    gender=?,
                    address=?,
                    treatment_start_date=?,
                    treatment_end_date=?,
                    treatment_status=?

                WHERE id=?
            `;



            db.run(
                sql,
                [

                    first_name,
                    last_name,
                    mobile,
                    age,
                    gender,
                    address,
                    treatment_start_date,
                    treatment_end_date,
                    treatment_status,
                    patientId

                ],
                function(err) {

                    if (err) {

                        return res.status(500).json({

                            success: false,

                            message: err.message
                        });
                    }



                    res.json({

                        success: true
                    });
                }
            );
        }
    );
};




// =====================================
// SEARCH PATIENTS
// =====================================
const searchPatients = (req, res) => {

    const query =
        req.query.query.toLowerCase();



    const sql = `
        SELECT *
        FROM patients
        WHERE

            LOWER(first_name || ' ' || last_name)
            LIKE ?

            OR

            mobile LIKE ?

        ORDER BY id ASC
    `;



    db.all(
        sql,
        [
            `%${query}%`,
            `%${query}%`
        ],
        (err, rows) => {

            if (err) {

                return res.status(500).json({

                    success: false
                });
            }



            res.json({

                success: true,

                data: rows
            });
        }
    );
};




// =====================================
// ANALYSIS FILTERS
// =====================================
const getPatientsByStatus = (req, res) => {

    const status = req.params.status;

    let sql = "";


    if (status === "ALL") {

        sql = `
            SELECT *
            FROM patients
            ORDER BY id ASC
        `;

    } else {

        sql = `
            SELECT *
            FROM patients
            WHERE treatment_status=?
            ORDER BY id ASC
        `;
    }



    db.all(
        sql,
        status === "ALL"
            ? []
            : [status],
        (err, rows) => {

            if (err) {

                return res.status(500).json({

                    success: false
                });
            }



            res.json({

                success: true,

                data: rows
            });
        }
    );
};



module.exports = {

    addPatient,

    updatePatient,

    searchPatients,

    getPatientsByStatus
};
