import axios from "axios";

const API_URL =
    "http://localhost:5000/patients";



export const addPatient = async (data) => {

    const response =
        await axios.post(API_URL, data);

    return response.data;
};



export const updatePatient = async (
    id,
    data
) => {

    const response =
        await axios.put(
            `${API_URL}/${id}`,
            data
        );

    return response.data;
};



export const searchPatients = async (
    query
) => {

    const response =
        await axios.get(
            `${API_URL}/search?query=${query}`
        );

    return response.data;
};



export const getPatientsByStatus = async (
    status
) => {

    const response =
        await axios.get(
            `${API_URL}/analysis/${status}`
        );

    return response.data;
};