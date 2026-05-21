import { useEffect, useState } from "react";

import jsPDF from "jspdf";

import { autoTable } from "jspdf-autotable";

import {
    getPatientsByStatus
} from "../services/patientService";

import { downloadPatientPDF } from "../utils/pdfReport";

export default function PatientAnalysis({

    onOpenOPDView,

    onOpenOPDAdd,

    onEdit

}) {

    const [patients, setPatients] = useState([]);

    const [activeOpdMenu, setActiveOpdMenu] = useState(null);

    const [title, setTitle] = useState("All Patients");



    // ==========================================
    // LOAD PATIENTS
    // ==========================================
    const loadPatients = async (status) => {

        const res = await getPatientsByStatus(status);

        setPatients(res.data);



        if (status === "ALL") {
            setTitle("All Patients");
        }

        if (status === "UNDER_TREATMENT") {
            setTitle("Under Treatment");
        }

        if (status === "COMPLETED") {
            setTitle("Completed");
        }
    };



    useEffect(() => {

        loadPatients("ALL");

    }, []);



    return (

        <div className="bg-white border border-slate-200 shadow-lg rounded-3xl p-6 mt-4">

            <div className="grid gap-4 lg:grid-cols-3 mb-6">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                    <p className="text-sm font-semibold text-slate-500">Current view</p>
                    <p className="mt-3 text-xl font-semibold text-slate-900">{title}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                    <p className="text-sm font-semibold text-slate-500">Patients loaded</p>
                    <p className="mt-3 text-xl font-semibold text-slate-900">{patients.length}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                    <p className="text-sm font-semibold text-slate-500">Next step</p>
                    <p className="mt-3 text-slate-700">Tap OPD to manage visits or add a visit directly from the action menu.</p>
                </div>
            </div>

            <div className="flex flex-wrap justify-between items-center mb-5 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-700">
                        {title}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">Filter patient status and check actionable insights in the table below.</p>
                </div>
            </div>



            {/* FILTERS */}
            <div className="flex gap-3 mb-6 flex-wrap">

                <button
                    onClick={() => loadPatients("ALL")}
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-md"
                >
                    All Patients
                </button>



                <button
                    onClick={() =>
                        loadPatients("UNDER_TREATMENT")
                    }
                    className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-md"
                >
                    Under Treatment
                </button>



                <button
                    onClick={() =>
                        loadPatients("COMPLETED")
                    }
                    className="bg-gradient-to-r from-green-500 to-emerald-700 text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-md"
                >
                    Completed
                </button>

            </div>



            {/* TABLE */}
            <div className="overflow-auto rounded-3xl border border-slate-200">

                <table className="w-full">

                    <thead className="bg-slate-100">

                        <tr>

                            <th className="text-left px-4 py-3 font-semibold text-slate-700 text-sm md:text-base">
                                Patient ID
                            </th>

                            <th className="text-left px-4 py-3 font-semibold text-slate-700 text-sm md:text-base">
                                Name
                            </th>

                            <th className="text-left px-4 py-3 font-semibold text-slate-700 text-sm md:text-base">
                                Mobile
                            </th>

                            <th className="text-left px-4 py-3 font-semibold text-slate-700 text-sm md:text-base">
                                Actions
                            </th>

                        </tr>

                    </thead>



                    <tbody>

                        {
                            patients.map((p) => (

                                <tr
                                    key={p.id}
                                    className="border-t hover:bg-blue-50 transition-all"
                                >

                                    <td className="px-6 py-4 text-slate-700 font-semibold">
                                        {p.id}
                                    </td>

                                    <td className="px-6 py-4 text-slate-700 font-medium">
                                        {p.first_name} {p.last_name}
                                    </td>

                                    <td className="px-6 py-4 text-slate-600">
                                        {p.mobile}
                                    </td>

                                    <td className="px-6 py-4">

                                        <div className="flex gap-3 flex-wrap">

                                            {/* OPD */}
                                            <div className="relative">
                                                <button
                                                    onClick={() =>
                                                        setActiveOpdMenu(activeOpdMenu === p.id ? null : p.id)
                                                    }
                                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-xl font-semibold shadow-md"
                                                >
                                                    OPD
                                                </button>

                                                {activeOpdMenu === p.id && (
                                                    <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white border border-slate-200 shadow-xl z-10">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                onOpenOPDView(p);
                                                                setActiveOpdMenu(null);
                                                            }}
                                                            className="block w-full text-left px-4 py-3 hover:bg-slate-100"
                                                        >
                                                            View OPDs
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                onOpenOPDAdd(p);
                                                                setActiveOpdMenu(null);
                                                            }}
                                                            className="block w-full text-left px-4 py-3 hover:bg-slate-100"
                                                        >
                                                            Add OPD Visit
                                                        </button>
                                                    </div>
                                                )}
                                            </div>


                                            {/* EDIT */}
                                            <button
                                                onClick={() => onEdit(p)}
                                                className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-md hover:scale-105 transition duration-300"
                                            >
                                                Edit
                                            </button>

                                            {/* PDF */}
                                            <button
                                                onClick={() => {
                                                    const includeMedicineBill = window.confirm("Include medicine bill PDF in the downloaded report?");
                                                    downloadPatientPDF(p, { includeMedicineBill });
                                                }}
                                                className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-md hover:scale-105 transition duration-300"
                                            >
                                                PDF
                                            </button>
                                        </div>

                                    </td>

                                </tr>
                            ))
                        }

                    </tbody>

                </table>

            </div>

        </div>
    );
}
