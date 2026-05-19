const db = require("./db");

// =========================
// PATIENTS TABLE
// =========================
db.run(`
CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    mobile TEXT,
    age INTEGER,
    gender TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`, (err) => {
    if (err) {
        console.log("Error creating patients table", err.message);
    } else {
        console.log("Patients table ready");
    }
});


// =========================
// OPD VISITS TABLE
// =========================
db.run(`
CREATE TABLE IF NOT EXISTS opd_visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    doctor_name TEXT,
    symptoms TEXT,
    diagnosis TEXT,
    notes TEXT,
    followup_date TEXT,
    visit_date DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(patient_id) REFERENCES patients(id)
)
`, (err) => {
    if (err) {
        console.log("Error creating opd_visits table", err.message);
    } else {
        console.log("OPD visits table ready");
    }
});


// =========================
// PRESCRIPTION IMAGES TABLE
// =========================
db.run(`
CREATE TABLE IF NOT EXISTS prescription_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    visit_id INTEGER,
    image_path TEXT NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(patient_id) REFERENCES patients(id),
    FOREIGN KEY(visit_id) REFERENCES opd_visits(id)
)
`, (err) => {
    if (err) {
        console.log("Error creating prescription_images table", err.message);
    } else {
        console.log("Prescription images table ready");
    }
});


// =========================
// MEDICINES TABLE
// =========================
db.run(`
CREATE TABLE IF NOT EXISTS medicines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    medicine_name TEXT NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    price REAL DEFAULT 0,
    expiry_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`, (err) => {
    if (err) {
        console.log("Error creating medicines table", err.message);
    } else {
        console.log("Medicines table ready");
    }
});


// =========================
// MEDICINE TRANSACTIONS TABLE
// =========================
db.run(`
CREATE TABLE IF NOT EXISTS medicine_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER,
    medicine_id INTEGER,
    quantity_given INTEGER,
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(patient_id) REFERENCES patients(id),
    FOREIGN KEY(medicine_id) REFERENCES medicines(id)
)
`, (err) => {
    if (err) {
        console.log("Error creating medicine_transactions table", err.message);
    } else {
        console.log("Medicine transactions table ready");
    }
});