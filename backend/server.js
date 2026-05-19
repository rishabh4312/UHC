const express = require("express");
const cors = require("cors");

const app = express();


// DATABASE INIT
require("./database/initDb");


// ROUTES
const patientRoutes = require("./routes/patientRoutes");
const opdRoutes = require("./routes/opdRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");


// MIDDLEWARE
app.use(cors());
app.use(express.json());


// STATIC FOLDER
app.use("/uploads", express.static("uploads"));


// API ROUTES
app.use("/patients", patientRoutes);
app.use("/opd", opdRoutes);
app.use("/prescriptions", prescriptionRoutes);


// TEST ROUTE
app.get("/", (req, res) => {
    res.send("UdayHealthCare Backend Running");
});


// SERVER
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});