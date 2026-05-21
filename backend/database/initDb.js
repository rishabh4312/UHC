const sqlite3 = require("sqlite3").verbose();

const path = require("path");

const dbPath = path.join(__dirname, "clinic-data.db");

const db = new sqlite3.Database(dbPath, (err) => {

    if (err) {

        console.log(err.message);

    } else {

        console.log("Connected to SQLite DB");
    }
});



// =====================================
// PATIENTS TABLE
// =====================================
db.run(`
CREATE TABLE IF NOT EXISTS patients (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    first_name TEXT NOT NULL,

    last_name TEXT NOT NULL,

    mobile TEXT NOT NULL,

    age INTEGER,

    gender TEXT,

    address TEXT,

    treatment_start_date TEXT,

    treatment_end_date TEXT,

    treatment_status TEXT DEFAULT 'UNDER_TREATMENT',

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(first_name, last_name, mobile)
)
`);




// =====================================
// OPD VISITS TABLE
// =====================================
db.run(`
CREATE TABLE IF NOT EXISTS opd_visits (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    patient_id INTEGER NOT NULL,

    doctor_name TEXT,

    symptoms TEXT,

    diagnosis TEXT,

    notes TEXT,

    medicines TEXT,

    followup_date TEXT,

    lab_report TEXT,

    medicine_bill TEXT,

    visit_date DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

db.all(`PRAGMA table_info(opd_visits)`, [], (err, columns) => {
    if (err) {
        console.log(err.message);
        return;
    }

    const hasMedicines = columns.some((column) => column.name === "medicines");
    if (!hasMedicines) {
        db.run(`ALTER TABLE opd_visits ADD COLUMN medicines TEXT`, (alterErr) => {
            if (alterErr) {
                console.log(alterErr.message);
            }
        });
    }

    const hasLabReport = columns.some((column) => column.name === "lab_report");
    if (!hasLabReport) {
        db.run(`ALTER TABLE opd_visits ADD COLUMN lab_report TEXT`, (alterErr) => {
            if (alterErr) {
                console.log(alterErr.message);
            }
        });
    }

    const hasMedicineBill = columns.some((column) => column.name === "medicine_bill");
    if (!hasMedicineBill) {
        db.run(`ALTER TABLE opd_visits ADD COLUMN medicine_bill TEXT`, (alterErr) => {
            if (alterErr) {
                console.log(alterErr.message);
            }
        });
    }
});




// =====================================
// PRESCRIPTION IMAGES TABLE
// =====================================
db.run(`
CREATE TABLE IF NOT EXISTS prescription_images (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    patient_id INTEGER,

    visit_id INTEGER,

    image_path TEXT,

    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);



module.exports = db;