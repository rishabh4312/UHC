import { useState } from "react";

import PatientForm from "../components/PatientForm";

import PatientDetailsModal from "../components/PatientDetailsModal";

import EditPatientModal from "../components/EditPatientModal";

import PatientAnalysis from "../components/PatientAnalysis";

import UdayHealthCareLogo from "../components/UdayHealthCareLogo";

import {
    searchPatients
} from "../services/patientService";



export default function Dashboard() {

    const [view, setView] = useState("SEARCH");

    const [search, setSearch] = useState("");

    const [patients, setPatients] = useState([]);

    const [selectedPatient, setSelectedPatient] = useState(null);

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

        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-6">

            {/* HEADER CARD */}
            <div className="mb-10 bg-white/70 backdrop-blur-xl border border-white/30 shadow-2xl rounded-[32px] p-8">

                <UdayHealthCareLogo />

            </div>



            {/* POPUP */}
            {
                popupMessage && (

                    <div className="fixed inset-0 flex items-center justify-center z-50">

                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-10 py-5 rounded-3xl shadow-2xl text-2xl font-bold animate-pulse">

                            {popupMessage}

                        </div>

                    </div>
                )
            }



            {/* NAVIGATION */}
            <div className="flex flex-wrap gap-4 mb-8">

                <button
                    onClick={() => setView("SEARCH")}
                    className={`px-7 py-4 rounded-2xl text-white font-bold shadow-xl transition-all duration-300 hover:scale-105
                    ${view === "SEARCH"
                            ? "bg-gradient-to-r from-blue-600 to-indigo-700"
                            : "bg-slate-700 hover:bg-slate-800"
                        }`}
                >
                    Search Patients
                </button>



                <button
                    onClick={() => setView("ADD")}
                    className={`px-7 py-4 rounded-2xl text-white font-bold shadow-xl transition-all duration-300 hover:scale-105
                    ${view === "ADD"
                            ? "bg-gradient-to-r from-emerald-500 to-green-700"
                            : "bg-slate-700 hover:bg-slate-800"
                        }`}
                >
                    Add Patient
                </button>



                <button
                    onClick={() => setView("ANALYSIS")}
                    className={`px-7 py-4 rounded-2xl text-white font-bold shadow-xl transition-all duration-300 hover:scale-105
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

                        <div className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-2xl rounded-[32px] p-8 mb-8">

                            <h2 className="text-3xl font-bold text-slate-700 mb-6">

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
                                    className="flex-1 border border-slate-200 rounded-2xl px-6 py-5 text-lg bg-white/80 shadow-sm outline-none focus:ring-4 focus:ring-blue-300"
                                />



                                <button
                                    onClick={handleSearch}
                                    className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-10 py-5 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all duration-300"
                                >
                                    Search
                                </button>

                            </div>

                        </div>



                        {/* RESULTS */}
                        {
                            patients.length > 0 && (

                                <div className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-2xl rounded-[32px] overflow-hidden">

                                    <div className="px-8 py-6 border-b bg-white/50">

                                        <h2 className="text-3xl font-bold text-slate-700">

                                            Search Results

                                        </h2>

                                    </div>



                                    <div className="overflow-auto">

                                        <table className="w-full">

                                            <thead className="bg-slate-100/80">

                                                <tr>

                                                    <th className="text-left px-8 py-5 text-slate-700 font-bold text-lg">
                                                        Patient Name
                                                    </th>

                                                    <th className="text-left px-8 py-5 text-slate-700 font-bold text-lg">
                                                        Mobile Number
                                                    </th>

                                                    <th className="text-left px-8 py-5 text-slate-700 font-bold text-lg">
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

                                                            <td className="px-8 py-5 text-slate-700 font-semibold text-lg">

                                                                {p.first_name} {p.last_name}

                                                            </td>



                                                            <td className="px-8 py-5 text-slate-600 text-lg">

                                                                {p.mobile}

                                                            </td>



                                                            <td className="px-8 py-5">

                                                                <div className="flex gap-4">

                                                                    <button
                                                                        onClick={() =>
                                                                            setSelectedPatient(p)
                                                                        }
                                                                        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all duration-300"
                                                                    >
                                                                        OPD
                                                                    </button>



                                                                    <button
                                                                        onClick={() =>
                                                                            setEditPatient(p)
                                                                        }
                                                                        className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:scale-105 transition-all duration-300"
                                                                    >
                                                                        Edit
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
                        onOpenOPD={(p) =>
                            setSelectedPatient(p)
                        }
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
                        onClose={() =>
                            setSelectedPatient(null)
                        }
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