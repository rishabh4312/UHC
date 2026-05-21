import axios from "axios";

const API_URL = "http://localhost:5000/opd";


// ADD OPD VISIT
export const addOpdVisit = async (data) => {

    const response = await axios.post(API_URL, data);

    return response.data;
};


// GET PATIENT OPD HISTORY
export const getPatientOpdHistory = async (patientId) => {

    const response = await axios.get(`${API_URL}/${patientId}`);

    return response.data;
};


// GET UPCOMING FOLLOW-UP APPOINTMENTS
export const getUpcomingAppointments = async () => {

    const response = await axios.get(`${API_URL}/upcoming`);

    return response.data;
};
