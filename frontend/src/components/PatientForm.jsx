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

            alert(`Patient added successfully. Patient ID: ${response.patient_id}`);

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

        <div className="bg-white p-6 rounded-[28px] shadow-xl border border-slate-200 max-w-3xl mx-auto">

            <h2 className="text-2xl font-semibold text-slate-800 mb-5">
                Add Patient
            </h2>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                        <span className="text-sm font-medium text-slate-600">First Name</span>
                        <input
                            name="first_name"
                            placeholder="Enter first name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="mt-2 w-full border border-slate-300 px-4 py-3 rounded-3xl bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm font-medium text-slate-600">Last Name</span>
                        <input
                            name="last_name"
                            placeholder="Enter last name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="mt-2 w-full border border-slate-300 px-4 py-3 rounded-3xl bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                        <span className="text-sm font-medium text-slate-600">Mobile Number</span>
                        <input
                            name="mobile"
                            placeholder="Enter mobile number"
                            value={formData.mobile}
                            onChange={handleChange}
                            className="mt-2 w-full border border-slate-300 px-4 py-3 rounded-3xl bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm font-medium text-slate-600">Age</span>
                        <input
                            name="age"
                            placeholder="Enter age"
                            value={formData.age}
                            onChange={handleChange}
                            className="mt-2 w-full border border-slate-300 px-4 py-3 rounded-3xl bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                        <span className="text-sm font-medium text-slate-600">Gender</span>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="mt-2 w-full border border-slate-300 px-4 py-3 rounded-3xl bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </label>

                    <label className="block">
                        <span className="text-sm font-medium text-slate-600">Address</span>
                        <textarea
                            name="address"
                            placeholder="Enter address"
                            value={formData.address}
                            onChange={handleChange}
                            className="mt-2 w-full min-h-[108px] border border-slate-300 px-4 py-3 rounded-3xl bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                        <span className="text-sm font-medium text-slate-600">Treatment Start Date</span>
                        <input
                            type="date"
                            name="treatment_start_date"
                            value={formData.treatment_start_date}
                            onChange={handleChange}
                            className="mt-2 w-full border border-slate-300 px-4 py-3 rounded-3xl bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm font-medium text-slate-600">Treatment End Date</span>
                        <input
                            type="date"
                            name="treatment_end_date"
                            value={formData.treatment_end_date}
                            onChange={handleChange}
                            className="mt-2 w-full border border-slate-300 px-4 py-3 rounded-3xl bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </label>
                </div>

                <button
                    className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-3xl font-semibold shadow-lg hover:bg-blue-700 transition-colors"
                >
                    Add Patient
                </button>

            </form>

        </div>
    );
}
