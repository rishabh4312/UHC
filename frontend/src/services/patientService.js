import axios from "axios";

const API_URL = "http://localhost:5000/patients";


// ADD PATIENT
export const addPatient = async (patientData) => {

    const response = await axios.post(API_URL, patientData);

    return response.data;
};


// GET ALL PATIENTS
export const getAllPatients = async () => {

    const response = await axios.get(API_URL);

    return response.data;
};