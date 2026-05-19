import { useState } from "react";
import { addPatient } from "../services/patientService";

export default function PatientForm({ refreshPatients }) {

    const [formData, setFormData] = useState({
        full_name: "",
        mobile: "",
        age: "",
        gender: "",
        address: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            await addPatient(formData);

            alert("Patient added successfully");

            setFormData({
                full_name: "",
                mobile: "",
                age: "",
                gender: "",
                address: ""
            });

            refreshPatients();

        } catch (error) {

            console.log(error);

            alert("Error adding patient");

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="bg-white shadow-lg rounded-xl p-6">

            <h2 className="text-2xl font-bold mb-6">
                Patient Registration
            </h2>

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >

                {/* FULL NAME */}
                <div>
                    <label className="block mb-1 font-medium">
                        Full Name
                    </label>

                    <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg px-3 py-2"
                    />
                </div>


                {/* MOBILE */}
                <div>
                    <label className="block mb-1 font-medium">
                        Mobile
                    </label>

                    <input
                        type="text"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2"
                    />
                </div>


                {/* AGE */}
                <div>
                    <label className="block mb-1 font-medium">
                        Age
                    </label>

                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2"
                    />
                </div>


                {/* GENDER */}
                <div>
                    <label className="block mb-1 font-medium">
                        Gender
                    </label>

                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2"
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>


                {/* ADDRESS */}
                <div>
                    <label className="block mb-1 font-medium">
                        Address
                    </label>

                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2"
                    />
                </div>


                {/* BUTTON */}
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                >
                    {
                        loading
                        ? "Saving..."
                        : "Save Patient"
                    }
                </button>

            </form>

        </div>
    );
}