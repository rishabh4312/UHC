import axios from "axios";

const API_URL = "http://localhost:5000/prescriptions";


// UPLOAD PRESCRIPTION
export const uploadPrescription = async (formData) => {

    const response = await axios.post(
        `${API_URL}/upload`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
};


// UPLOAD LAB REPORT
export const uploadLabReport = async (formData) => {

    const response = await axios.post(
        `${API_URL}/upload-lab`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
};


// GET PRESCRIPTIONS BY VISIT
export const getPrescriptionsByVisit = async (visitId) => {

    const response = await axios.get(`${API_URL}/${visitId}`);

    return response.data;
};