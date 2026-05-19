import { useEffect, useState } from "react";

import {
    addOpdVisit,
    getPatientOpdHistory
} from "../services/opdService";

import {
    uploadPrescription,
    getPrescriptionsByVisit
} from "../services/prescriptionService";


export default function PatientDetailsModal({

    patient,
    onClose

}) {

    const [history, setHistory] = useState([]);

    const [selectedFile, setSelectedFile] = useState(null);

    const [prescriptions, setPrescriptions] = useState([]);

    const [formData, setFormData] = useState({

        doctor_name: "Rajesh",
        symptoms: "",
        diagnosis: "",
        notes: "",
        followup_date: ""
    });



    // =====================================
    // LOAD PRESCRIPTIONS
    // =====================================
    const loadPrescriptions = async (visitId) => {

        try {

            const response = await getPrescriptionsByVisit(visitId);

            setPrescriptions((prev) => [

                ...prev.filter(
                    (img) => img.visit_id !== visitId
                ),

                ...response.data
            ]);

        } catch (error) {

            console.log(error);
        }
    };



    // =====================================
    // LOAD OPD HISTORY
    // =====================================
    const loadHistory = async () => {

        try {

            const response = await getPatientOpdHistory(patient.id);

            setHistory(response.data);

            // LOAD PRESCRIPTIONS FOR EACH VISIT
            response.data.forEach((visit) => {

                loadPrescriptions(visit.id);
            });

        } catch (error) {

            console.log(error);
        }
    };



    useEffect(() => {

        if (patient) {

            loadHistory();
        }

    }, [patient]);



    // =====================================
    // HANDLE INPUT CHANGE
    // =====================================
    const handleChange = (e) => {

        setFormData({

            ...formData,
            [e.target.name]: e.target.value
        });
    };



    // =====================================
    // HANDLE SUBMIT
    // =====================================
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            // SAVE OPD VISIT
            const response = await addOpdVisit({

                patient_id: patient.id,
                ...formData
            });

            const latestVisitId = response.visit_id;


            // UPLOAD PRESCRIPTION IMAGE
            if (selectedFile) {

                const formDataObj = new FormData();

                formDataObj.append(
                    "prescription",
                    selectedFile
                );

                formDataObj.append(
                    "patient_id",
                    patient.id
                );

                formDataObj.append(
                    "visit_id",
                    latestVisitId
                );

                await uploadPrescription(formDataObj);
            }


            alert("OPD visit saved successfully");


            // RESET FORM
            setFormData({

                doctor_name: "Rajesh",
                symptoms: "",
                diagnosis: "",
                notes: "",
                followup_date: ""
            });

            setSelectedFile(null);


            // RELOAD HISTORY
            loadHistory();

        } catch (error) {

            console.log(error);

            alert("Error saving OPD visit");
        }
    };



    if (!patient) return null;



    return (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">

            <div className="bg-white rounded-xl w-full max-w-6xl p-6 overflow-auto max-h-[95vh]">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">

                    <div>

                        <h2 className="text-3xl font-bold">
                            {patient.full_name}
                        </h2>

                        <p className="text-gray-600">
                            Mobile: {patient.mobile}
                        </p>

                        <p className="text-gray-600">
                            Age: {patient.age}
                        </p>

                        <p className="text-gray-600">
                            Gender: {patient.gender}
                        </p>

                    </div>


                    <button
                        onClick={onClose}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                        Close
                    </button>

                </div>



                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* LEFT SIDE */}
                    <div className="bg-gray-100 p-5 rounded-xl">

                        <h3 className="text-2xl font-bold mb-5">
                            New OPD Visit
                        </h3>


                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >

                            {/* DOCTOR NAME */}
                            <div>

                                <label className="block mb-1 font-medium">
                                    Doctor Name
                                </label>

                                <input
                                    type="text"
                                    name="doctor_name"
                                    value={formData.doctor_name}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2"
                                />

                            </div>



                            {/* SYMPTOMS */}
                            <div>

                                <label className="block mb-1 font-medium">
                                    Symptoms
                                </label>

                                <textarea
                                    name="symptoms"
                                    value={formData.symptoms}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full border rounded-lg px-3 py-2"
                                />

                            </div>



                            {/* DIAGNOSIS */}
                            <div>

                                <label className="block mb-1 font-medium">
                                    Diagnosis
                                </label>

                                <textarea
                                    name="diagnosis"
                                    value={formData.diagnosis}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full border rounded-lg px-3 py-2"
                                />

                            </div>



                            {/* NOTES */}
                            <div>

                                <label className="block mb-1 font-medium">
                                    Notes
                                </label>

                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full border rounded-lg px-3 py-2"
                                />

                            </div>



                            {/* FOLLOWUP DATE */}
                            <div>

                                <label className="block mb-1 font-medium">
                                    Follow-up Date
                                </label>

                                <input
                                    type="date"
                                    name="followup_date"
                                    value={formData.followup_date}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg px-3 py-2"
                                />

                            </div>



                            {/* PRESCRIPTION IMAGE */}
                            <div>

                                <label className="block mb-1 font-medium">
                                    Upload Prescription Image
                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setSelectedFile(
                                            e.target.files[0]
                                        )
                                    }
                                    className="w-full border rounded-lg px-3 py-2 bg-white"
                                />

                            </div>



                            {/* SAVE BUTTON */}
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                            >
                                Save OPD Visit
                            </button>

                        </form>

                    </div>



                    {/* RIGHT SIDE */}
                    <div className="bg-gray-100 p-5 rounded-xl">

                        <h3 className="text-2xl font-bold mb-5">
                            OPD History
                        </h3>


                        <div className="space-y-5">

                            {
                                history.length === 0 && (

                                    <div className="bg-white p-4 rounded-lg shadow">

                                        No OPD history found

                                    </div>
                                )
                            }



                            {
                                history.map((visit) => (

                                    <div
                                        key={visit.id}
                                        className="bg-white p-4 rounded-lg shadow"
                                    >

                                        <div className="mb-3">

                                            <p>
                                                <strong>Visit Date:</strong>{" "}
                                                {visit.visit_date}
                                            </p>

                                            <p>
                                                <strong>Doctor:</strong>{" "}
                                                {visit.doctor_name}
                                            </p>

                                        </div>



                                        <div className="space-y-2">

                                            <p>
                                                <strong>Symptoms:</strong>{" "}
                                                {visit.symptoms}
                                            </p>

                                            <p>
                                                <strong>Diagnosis:</strong>{" "}
                                                {visit.diagnosis}
                                            </p>

                                            <p>
                                                <strong>Notes:</strong>{" "}
                                                {visit.notes}
                                            </p>

                                            <p>
                                                <strong>Follow-up:</strong>{" "}
                                                {visit.followup_date || "N/A"}
                                            </p>

                                        </div>



                                        {/* PRESCRIPTION IMAGES */}
                                        <div className="mt-4 flex flex-wrap gap-3">

                                            {
                                                prescriptions
                                                    .filter(
                                                        (img) =>
                                                            img.visit_id === visit.id
                                                    )
                                                    .map((img) => (

                                                        <img
                                                            key={img.id}
                                                            src={`http://localhost:5000/${img.image_path}`}
                                                            alt="Prescription"
                                                            className="w-40 h-40 object-cover rounded-lg border cursor-pointer hover:scale-105 transition"
                                                            onClick={() =>
                                                                window.open(
                                                                    `http://localhost:5000/${img.image_path}`,
                                                                    "_blank"
                                                                )
                                                            }
                                                        />
                                                    ))
                                            }

                                        </div>

                                    </div>
                                ))
                            }

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}