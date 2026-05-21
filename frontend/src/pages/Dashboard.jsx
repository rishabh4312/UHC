import { useState } from "react";

import PatientForm from "../components/PatientForm";

import PatientDetailsModal from "../components/PatientDetailsModal";

import EditPatientModal from "../components/EditPatientModal";

import PatientAnalysis from "../components/PatientAnalysis";

import UdayHealthCareLogo from "../components/UdayHealthCareLogo";

import {
    searchPatients
} from "../services/patientService";

import { downloadPatientPDF } from "../utils/pdfReport";



export default function Dashboard() {

    const [view, setView] = useState("SEARCH");

    const [search, setSearch] = useState("");

    const [patients, setPatients] = useState([]);

    const [selectedPatient, setSelectedPatient] = useState(null);

    const [selectedPatientOpdMode, setSelectedPatientOpdMode] = useState(null);

    const [editPatient, setEditPatient] = useState(null);

    const [popupMessage, setPopupMessage] = useState("");



    // ==========================================
    // SEARCH PATIENT
    // ==========================================
    const handleSearch = async () => {

        if (!search.trim()) return;

        try {

            const res = await searchPatients(search);

            setPatients(res.data);



            if (res.data.length > 0) {

                setPopupMessage("Patient Found");

            } else {

                setPopupMessage("Patient Not Found");
            }



            setTimeout(() => {

                setPopupMessage("");

            }, 2000);

        } catch (err) {

            alert("Search failed");
        }
    };



    // ==========================================
    // ENTER KEY SEARCH
    // ==========================================
    const handleKeyDown = (e) => {

        if (e.key === "Enter") {

            handleSearch();
        }
    };



    return (

        <div className="min-h-screen bg-slate-50 p-4 md:p-6">

            {/* HERO CARD */}
            <div className="mb-8 rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-50 via-slate-100 to-white p-6 shadow-xl">
                <div className="grid gap-6 lg:grid-cols-[1.6fr_0.95fr] items-start">
                    <div className="space-y-6">
                        <UdayHealthCareLogo />
                        <div className="rounded-3xl bg-slate-950 p-5 text-white shadow-lg">
                            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Clinic overview</p>
                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-3xl bg-white p-4 text-slate-900">
                                    <p className="text-sm font-semibold">Search results</p>
                                    <p className="mt-3 text-3xl font-semibold">{patients.length}</p>
                                </div>
                                <div className="rounded-3xl bg-white p-4 text-slate-900">
                                    <p className="text-sm font-semibold">Selected action</p>
                                    <p className="mt-3 text-base text-slate-600">Use the search bar to find patients, then open OPD history or add new visits.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm font-semibold text-slate-500">Quick start</p>
                            <p className="mt-3 text-slate-700">Search by patient name or mobile number, then manage visits directly from search results.</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white shadow-lg">
                            <p className="text-sm uppercase tracking-[0.18em] text-blue-100">Pro tip</p>
                            <p className="mt-3 text-base font-semibold">Keep patient records updated so OPD history and prescriptions are easy to retrieve.</p>
                        </div>
                    </div>
                </div>
            </div>


            {/* POPUP */}
            {
                popupMessage && (

                    <div className="fixed inset-0 flex items-center justify-center z-50">

                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-3xl shadow-lg text-xl font-semibold animate-pulse">

                            {popupMessage}

                        </div>

                    </div>
                )
            }



            {/* NAVIGATION */}
            <div className="flex flex-wrap gap-3 mb-6">

                <button
                    onClick={() => setView("SEARCH")}
                    className={`px-5 py-3 rounded-2xl text-white text-sm md:text-base font-semibold shadow-lg transition duration-300 hover:scale-105
                    ${view === "SEARCH"
                            ? "bg-gradient-to-r from-blue-600 to-indigo-700"
                            : "bg-slate-700 hover:bg-slate-800"
                        }`}
                >
                    Search Patients
                </button>



                <button
                    onClick={() => setView("ADD")}
                    className={`px-5 py-3 rounded-2xl text-white text-sm md:text-base font-semibold shadow-lg transition duration-300 hover:scale-105
                    ${view === "ADD"
                            ? "bg-gradient-to-r from-emerald-500 to-green-700"
                            : "bg-slate-700 hover:bg-slate-800"
                        }`}
                >
                    Add Patient
                </button>



                <button
                    onClick={() => setView("ANALYSIS")}
                    className={`px-5 py-3 rounded-2xl text-white text-sm md:text-base font-semibold shadow-lg transition duration-300 hover:scale-105
                    ${view === "ANALYSIS"
                            ? "bg-gradient-to-r from-purple-600 to-pink-600"
                            : "bg-slate-700 hover:bg-slate-800"
                        }`}
                >
                    Patients Analysis
                </button>

            </div>



            {/* SEARCH VIEW */}
            {
                view === "SEARCH" && (

                    <>

                        <div className="bg-white border border-slate-200 shadow-lg rounded-3xl p-6 mb-6">

                            <h2 className="text-2xl font-semibold text-slate-700 mb-5">

                                Search Patient

                            </h2>



                            <div className="flex flex-col lg:flex-row gap-5">

                                <input
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search by patient name or mobile number"
                                    className="flex-1 border border-slate-200 rounded-2xl px-4 py-3 text-base bg-white/90 shadow-sm outline-none focus:ring-3 focus:ring-blue-300"
                                />

                                <button
                                    onClick={handleSearch}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 transition duration-300"
                                >
                                    Search
                                </button>

                            </div>
                            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                                    <p className="text-sm font-semibold text-slate-700">Search tip</p>
                                    <p className="mt-3 text-sm text-slate-500">Use names or mobile numbers to find patients faster.</p>
                                </div>
                                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                                    <p className="text-sm font-semibold text-slate-700">Need help?</p>
                                    <p className="mt-3 text-sm text-slate-500">Select a patient record to view OPD history or download their PDF report.</p>
                                </div>
                                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                                    <p className="text-sm font-semibold text-slate-700">Pro workflow</p>
                                    <p className="mt-3 text-sm text-slate-500">Switch to Add Patient whenever you need to register a new patient quickly.</p>
                                </div>
                            </div>
                        </div>



                        {/* RESULTS */}
                        {
                            patients.length > 0 && (

                                <div className="bg-white border border-slate-200 shadow-lg rounded-3xl overflow-hidden">

                                    <div className="px-6 py-5 border-b bg-white/50">

                                        <h2 className="text-2xl font-bold text-slate-700">

                                            Search Results

                                        </h2>

                                    </div>



                                    <div className="overflow-auto">

                                        <table className="w-full">

                                            <thead className="bg-slate-100/80">

                                                <tr>

                                                    <th className="text-left px-5 py-3 text-slate-700 font-semibold text-sm md:text-base">
                                                        Patient Name
                                                    </th>

                                                    <th className="text-left px-5 py-3 text-slate-700 font-semibold text-sm md:text-base">
                                                        Mobile Number
                                                    </th>

                                                    <th className="text-left px-5 py-3 text-slate-700 font-semibold text-sm md:text-base">
                                                        Actions
                                                    </th>

                                                </tr>

                                            </thead>



                                            <tbody>

                                                {
                                                    patients.map((p) => (

                                                        <tr
                                                            key={p.id}
                                                            className="border-t border-slate-200 hover:bg-blue-50/70 transition-all"
                                                        >

                                                            <td className="px-5 py-4 text-slate-700 font-semibold text-sm md:text-base">

                                                                {p.first_name} {p.last_name}

                                                            </td>



                                                            <td className="px-5 py-4 text-slate-600 text-sm md:text-base">

                                                                {p.mobile}

                                                            </td>



                                                            <td className="px-5 py-4">

                                                                <div className="flex gap-4">

                                                                    <button
                                                                        onClick={() =>
                                                                            setSelectedPatient(p)
                                                                        }
                                                                        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-md hover:scale-105 transition duration-300"
                                                                    >
                                                                        OPD
                                                                    </button>



                                                                    <button
                                                                        onClick={() =>
                                                                            setEditPatient(p)
                                                                        }
                                                                        className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-md hover:scale-105 transition duration-300"
                                                                    >
                                                                        Edit
                                                                    </button>



                                                                    <button
                                                                        onClick={() =>
                                                                            downloadPatientPDF(p).catch(() => alert("Failed to generate PDF"))
                                                                        }
                                                                        className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-md hover:scale-105 transition duration-300"
                                                                    >
                                                                        Download PDF
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
                            )
                        }

                    </>
                )
            }



            {/* ADD VIEW */}
            {
                view === "ADD" && (

                    <PatientForm />
                )
            }



            {/* ANALYSIS VIEW */}
            {
                view === "ANALYSIS" && (

                    <PatientAnalysis
                        onOpenOPDView={(p) => {
                            setSelectedPatient(p)
                            setSelectedPatientOpdMode("VIEW")
                        }}
                        onOpenOPDAdd={(p) => {
                            setSelectedPatient(p)
                            setSelectedPatientOpdMode("ADD")
                        }}
                        onEdit={(p) =>
                            setEditPatient(p)
                        }
                    />
                )
            }



            {/* MODALS */}
            {
                selectedPatient && (

                    <PatientDetailsModal
                        patient={selectedPatient}
                        mode={selectedPatientOpdMode}
                        onClose={() => {
                            setSelectedPatient(null)
                            setSelectedPatientOpdMode(null)
                        }}
                    />
                )
            }



            {
                editPatient && (

                    <EditPatientModal
                        patient={editPatient}
                        onClose={() =>
                            setEditPatient(null)
                        }
                        onUpdated={() =>
                            setView("SEARCH")
                        }
                    />
                )
            }

        </div>
    );
}