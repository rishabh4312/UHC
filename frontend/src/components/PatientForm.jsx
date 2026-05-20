import { useState } from "react";

import { addPatient } from "../services/patientService";


export default function PatientForm({

    onPatientExists

}) {

    const [formData, setFormData] = useState({

        first_name: "",
        last_name: "",
        mobile: "",
        age: "",
        gender: "",
        address: "",
        treatment_start_date: "",
        treatment_end_date: ""
    });



    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value
        });
    };



    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response =
                await addPatient(formData);

            alert("Patient added successfully");

            setFormData({

                first_name: "",
                last_name: "",
                mobile: "",
                age: "",
                gender: "",
                address: "",
                treatment_start_date: "",
                treatment_end_date: ""
            });

        } catch (error) {

            if (
                error.response?.data?.alreadyExists
            ) {

                alert("Patient already exists");

                if (onPatientExists) {

                    onPatientExists(
                        error.response.data.patient
                    );
                }

            } else {

                alert("Error adding patient");
            }
        }
    };



    return (

        <div className="bg-white p-6 rounded-xl shadow-lg">

            <h2 className="text-2xl font-bold mb-4">
                Add Patient
            </h2>



            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >

                <input
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />



                <input
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />



                <input
                    name="mobile"
                    placeholder="Mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />



                <input
                    name="age"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />



                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                >

                    <option value="">
                        Gender
                    </option>

                    <option value="Male">
                        Male
                    </option>

                    <option value="Female">
                        Female
                    </option>

                </select>



                <textarea
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />



                <input
                    type="date"
                    name="treatment_start_date"
                    value={formData.treatment_start_date}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />



                <input
                    type="date"
                    name="treatment_end_date"
                    value={formData.treatment_end_date}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                />



                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Add Patient
                </button>

            </form>

        </div>
    );
}