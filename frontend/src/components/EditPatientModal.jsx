import { useState } from "react";

import {
    updatePatient
} from "../services/patientService";


export default function EditPatientModal({

    patient,

    onClose,

    onUpdated

}) {

    const [formData, setFormData] = useState({

        first_name: patient.first_name || "",

        last_name: patient.last_name || "",

        mobile: patient.mobile || "",

        age: patient.age || "",

        gender: patient.gender || "",

        address: patient.address || "",

        treatment_start_date:
            patient.treatment_start_date || "",

        treatment_end_date:
            patient.treatment_end_date || ""
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

            await updatePatient(
                patient.id,
                formData
            );

            alert("Patient updated successfully");

            if (onUpdated) {

                onUpdated();
            }

            onClose();

        } catch (error) {

            if (
                error.response?.data?.alreadyExists
            ) {

                alert("Duplicate patient exists");

            } else {

                alert("Update failed");
            }
        }
    };



    return (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">

            <div className="bg-white p-6 rounded-xl w-[500px]">

                <h2 className="text-xl font-bold mb-4">
                    Edit Patient
                </h2>



                <form
                    onSubmit={handleSubmit}
                    className="space-y-3"
                >

                    <input
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="First Name"
                    />



                    <input
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="Last Name"
                    />



                    <input
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="Mobile"
                    />



                    <input
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="Age"
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
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        placeholder="Address"
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



                    <div className="flex gap-2">

                        <button
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            Update
                        </button>



                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Close
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}