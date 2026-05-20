import { useState } from "react";



export default function PatientDetailsModal({

    patient,

    onClose

}) {

    // ==========================================
    // EXISTING OPDS
    // ==========================================
    const [opdHistory, setOpdHistory] = useState(
        patient.opd_visits || []
    );



    // ==========================================
    // NEW OPD FORM
    // ==========================================
    const [formData, setFormData] = useState({

        symptoms: "",

        diagnosis: "",

        medicines: "",

        notes: "",

        visit_date: new Date()
            .toISOString()
            .split("T")[0]
    });



    const [prescriptionImage, setPrescriptionImage] =
        useState(null);

    const [labReport, setLabReport] =
        useState(null);



    // ==========================================
    // HANDLE INPUT
    // ==========================================
    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value
        });
    };



    // ==========================================
    // PRESCRIPTION IMAGE
    // ==========================================
    const handlePrescriptionUpload = (e) => {

        const file = e.target.files[0];

        if (file) {

            setPrescriptionImage(
                URL.createObjectURL(file)
            );
        }
    };



    // ==========================================
    // LAB REPORT
    // ==========================================
    const handleLabReportUpload = (e) => {

        const file = e.target.files[0];

        if (file) {

            setLabReport(
                URL.createObjectURL(file)
            );
        }
    };



    // ==========================================
    // SAVE NEW OPD
    // ==========================================
    const handleSave = () => {

        const newOPD = {

            id: Date.now(),

            ...formData,

            prescription_image:
                prescriptionImage,

            lab_report:
                labReport
        };



        setOpdHistory([
            newOPD,
            ...opdHistory
        ]);



        alert(
            "OPD Visit Saved Successfully"
        );



        // RESET FORM
        setFormData({

            symptoms: "",

            diagnosis: "",

            medicines: "",

            notes: "",

            visit_date: new Date()
                .toISOString()
                .split("T")[0]
        });



        setPrescriptionImage(null);

        setLabReport(null);
    };



    return (

        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-auto">

            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-6xl overflow-hidden">

                {/* HEADER */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex justify-between items-center">

                    <div>

                        <h2 className="text-3xl font-bold">

                            Patient OPD

                        </h2>



                        <p className="opacity-90 mt-1 text-lg">

                            {patient.first_name}{" "}
                            {patient.last_name}

                        </p>

                    </div>



                    <button
                        onClick={onClose}
                        className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl font-bold"
                    >
                        Close
                    </button>

                </div>



                {/* BODY */}
                <div className="p-8 space-y-10 max-h-[85vh] overflow-auto">

                    {/* PATIENT INFO */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        <div className="bg-slate-50 rounded-2xl p-5 shadow-sm">

                            <p className="text-slate-500 text-sm">

                                Mobile

                            </p>

                            <p className="text-xl font-bold text-slate-700">

                                {patient.mobile}

                            </p>

                        </div>



                        <div className="bg-slate-50 rounded-2xl p-5 shadow-sm">

                            <p className="text-slate-500 text-sm">

                                Age

                            </p>

                            <p className="text-xl font-bold text-slate-700">

                                {patient.age}

                            </p>

                        </div>



                        <div className="bg-slate-50 rounded-2xl p-5 shadow-sm">

                            <p className="text-slate-500 text-sm">

                                Gender

                            </p>

                            <p className="text-xl font-bold text-slate-700">

                                {patient.gender}

                            </p>

                        </div>

                    </div>



                    {/* ========================================= */}
                    {/* PREVIOUS OPD HISTORY */}
                    {/* ========================================= */}
                    <div>

                        <h3 className="text-3xl font-bold text-slate-700 mb-6">

                            Previous OPD Visits

                        </h3>



                        {
                            opdHistory.length === 0 ? (

                                <div className="bg-slate-100 rounded-3xl p-8 text-center text-slate-500 text-lg">

                                    No Previous OPDs Found

                                </div>

                            ) : (

                                <div className="space-y-6">

                                    {
                                        opdHistory.map((opd) => (

                                            <div
                                                key={opd.id}
                                                className="bg-white border border-slate-200 rounded-3xl shadow-lg p-6"
                                            >

                                                {/* DATE */}
                                                <div className="flex justify-between items-center mb-4">

                                                    <h4 className="text-2xl font-bold text-indigo-700">

                                                        Visit Date:
                                                        {" "}
                                                        {opd.visit_date}

                                                    </h4>

                                                </div>



                                                {/* DETAILS */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                                    <div className="bg-slate-50 rounded-2xl p-4">

                                                        <p className="font-semibold text-slate-500 mb-2">

                                                            Symptoms

                                                        </p>

                                                        <p className="text-slate-700">

                                                            {opd.symptoms}

                                                        </p>

                                                    </div>



                                                    <div className="bg-slate-50 rounded-2xl p-4">

                                                        <p className="font-semibold text-slate-500 mb-2">

                                                            Diagnosis

                                                        </p>

                                                        <p className="text-slate-700">

                                                            {opd.diagnosis}

                                                        </p>

                                                    </div>



                                                    <div className="bg-slate-50 rounded-2xl p-4">

                                                        <p className="font-semibold text-slate-500 mb-2">

                                                            Medicines

                                                        </p>

                                                        <p className="text-slate-700">

                                                            {opd.medicines}

                                                        </p>

                                                    </div>



                                                    <div className="bg-slate-50 rounded-2xl p-4">

                                                        <p className="font-semibold text-slate-500 mb-2">

                                                            Notes

                                                        </p>

                                                        <p className="text-slate-700">

                                                            {opd.notes}

                                                        </p>

                                                    </div>

                                                </div>



                                                {/* PRESCRIPTION IMAGE */}
                                                {
                                                    opd.prescription_image && (

                                                        <div className="mt-6">

                                                            <h5 className="text-lg font-bold text-slate-700 mb-3">

                                                                Prescription

                                                            </h5>

                                                            <img
                                                                src={
                                                                    opd.prescription_image
                                                                }
                                                                alt="Prescription"
                                                                className="rounded-2xl border border-slate-200 max-h-[400px]"
                                                            />

                                                        </div>
                                                    )
                                                }



                                                {/* LAB REPORT */}
                                                {
                                                    opd.lab_report && (

                                                        <div className="mt-6">

                                                            <h5 className="text-lg font-bold text-slate-700 mb-3">

                                                                Lab Report

                                                            </h5>

                                                            <img
                                                                src={
                                                                    opd.lab_report
                                                                }
                                                                alt="Lab Report"
                                                                className="rounded-2xl border border-slate-200 max-h-[400px]"
                                                            />

                                                        </div>
                                                    )
                                                }

                                            </div>
                                        ))
                                    }

                                </div>
                            )
                        }

                    </div>



                    {/* ========================================= */}
                    {/* NEW OPD FORM */}
                    {/* ========================================= */}
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">

                        <h3 className="text-3xl font-bold text-slate-700 mb-6">

                            Add New OPD Visit

                        </h3>



                        {/* DATE */}
                        <div className="mb-6">

                            <label className="block mb-2 font-semibold text-slate-700">

                                Visit Date

                            </label>

                            <input
                                type="date"
                                name="visit_date"
                                value={formData.visit_date}
                                onChange={handleChange}
                                className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-300"
                            />

                        </div>



                        {/* TEXTAREAS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {
                                [
                                    ["symptoms", "Symptoms"],
                                    ["diagnosis", "Diagnosis"],
                                    ["medicines", "Medicines"],
                                    ["notes", "Additional Notes"]
                                ].map(([name, label]) => (

                                    <div key={name}>

                                        <label className="block mb-2 font-semibold text-slate-700">

                                            {label}

                                        </label>

                                        <textarea
                                            name={name}
                                            value={formData[name]}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full border border-slate-300 rounded-2xl px-4 py-3 outline-none focus:ring-4 focus:ring-blue-300"
                                        />

                                    </div>
                                ))
                            }

                        </div>



                        {/* IMAGE UPLOADS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

                            {/* PRESCRIPTION */}
                            <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6">

                                <div className="flex justify-between items-center mb-4">

                                    <h4 className="text-xl font-bold text-slate-700">

                                        Prescription

                                    </h4>



                                    <label className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 py-3 rounded-2xl font-bold shadow-lg cursor-pointer">

                                        Upload

                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={
                                                handlePrescriptionUpload
                                            }
                                        />

                                    </label>

                                </div>



                                {
                                    prescriptionImage && (

                                        <img
                                            src={prescriptionImage}
                                            alt="Prescription"
                                            className="rounded-2xl border border-slate-200 max-h-[300px]"
                                        />
                                    )
                                }

                            </div>



                            {/* LAB REPORT */}
                            <div className="bg-purple-50 border border-purple-100 rounded-3xl p-6">

                                <div className="flex justify-between items-center mb-4">

                                    <h4 className="text-xl font-bold text-slate-700">

                                        Lab Report

                                    </h4>



                                    <label className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-3 rounded-2xl font-bold shadow-lg cursor-pointer">

                                        Upload

                                        <input
                                            type="file"
                                            className="hidden"
                                            onChange={
                                                handleLabReportUpload
                                            }
                                        />

                                    </label>

                                </div>



                                {
                                    labReport && (

                                        <img
                                            src={labReport}
                                            alt="Lab Report"
                                            className="rounded-2xl border border-slate-200 max-h-[300px]"
                                        />
                                    )
                                }

                            </div>

                        </div>



                        {/* SAVE */}
                        <div className="flex justify-end mt-8">

                            <button
                                onClick={handleSave}
                                className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-10 py-4 rounded-2xl text-lg font-bold shadow-xl hover:scale-105 transition-all duration-300"
                            >
                                Save OPD Visit
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}