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

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">

            <div className="bg-white p-6 rounded-3xl w-full max-w-xl shadow-xl border border-slate-200">

                <h2 className="text-2xl font-semibold mb-5 text-slate-800">
                    Edit Patient
                </h2>



                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <input
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className="mt-2 w-full border border-slate-300 px-3 py-2 rounded-2xl bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
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
                        className="mt-2 w-full border border-slate-300 px-3 py-2 rounded-2xl bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
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
                        className="mt-2 w-full border border-slate-300 px-3 py-2 rounded-2xl bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
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



                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

                        <button
                            className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-2xl text-sm font-semibold shadow-lg hover:bg-emerald-700 transition duration-300"
                        >
                            Update
                        </button>



                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-slate-200 text-slate-800 px-4 py-3 rounded-2xl text-sm font-semibold hover:bg-slate-300 transition duration-300"
                        >
                            Close
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}