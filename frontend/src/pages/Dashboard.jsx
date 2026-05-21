import { useEffect, useState } from "react";

import PatientForm from "../components/PatientForm";

import PatientDetailsModal from "../components/PatientDetailsModal";

import EditPatientModal from "../components/EditPatientModal";

import PatientAnalysis from "../components/PatientAnalysis";

import UdayHealthCareLogo from "../components/UdayHealthCareLogo";

import {
    getPatientsByStatus,
    searchPatients
} from "../services/patientService";

import {
    getUpcomingAppointments
} from "../services/opdService";

import { downloadPatientPDF } from "../utils/pdfReport";



export default function Dashboard() {

    const [view, setView] = useState("SEARCH");

    const [search, setSearch] = useState("");

    const [patients, setPatients] = useState([]);

    const [totalPatients, setTotalPatients] = useState(0);

    const [upcomingAppointments, setUpcomingAppointments] = useState([]);

    const [loadingAppointments, setLoadingAppointments] = useState(false);

    const [selectedPatient, setSelectedPatient] = useState(null);

    const [selectedPatientOpdMode, setSelectedPatientOpdMode] = useState(null);

    const [editPatient, setEditPatient] = useState(null);

    const [popupMessage, setPopupMessage] = useState("");



    const formatAppointmentDate = (dateString) => {

        if (!dateString) return "Not scheduled";

        const [year, month, day] = dateString.split("-").map(Number);

        const date = new Date(year, month - 1, day);

        if (Number.isNaN(date.getTime())) return dateString;

        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            weekday: "short"
        });
    };



    const loadUpcomingAppointments = async () => {

        setLoadingAppointments(true);

        try {

            const res = await getUpcomingAppointments();

            if (res.success) {

                setUpcomingAppointments(res.data || []);

            } else {

                setUpcomingAppointments([]);
            }

        } catch (err) {

            alert("Failed to load upcoming appointments");

            setUpcomingAppointments([]);

        } finally {

            setLoadingAppointments(false);
        }
    };



    const loadTotalPatients = async () => {

        try {

            const res = await getPatientsByStatus("ALL");

            if (res.success) {

                setTotalPatients((res.data || []).length);

            } else {

                setTotalPatients(0);
            }

        } catch (err) {

            setTotalPatients(0);
        }
    };



    useEffect(() => {

        loadTotalPatients();
        loadUpcomingAppointments();

    }, []);



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

        <div className="min-h-screen bg-slate-100 p-3 md:p-5">

            <div className="mx-auto max-w-7xl">

            {/* HEADER */}
            <div className="mb-5 rounded-3xl border border-slate-200 bg-white px-4 py-4 shadow-sm md:px-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <UdayHealthCareLogo />
                        <div className="min-w-0 border-t border-slate-200 pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                            <h1 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
                                Patient Management System
                            </h1>
                            <p className="mt-1 text-sm font-semibold uppercase tracking-[0.16em] text-[#004aad]">
                                Neurology Clinic
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:min-w-[360px]">
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Total Patients</p>
                            <p className="mt-1 text-2xl font-bold text-slate-900">{totalPatients}</p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Upcoming Appointments</p>
                            <p className="mt-1 text-2xl font-bold text-slate-900">{upcomingAppointments.length}</p>
                        </div>
                    </div>
                </div>

                {/* NAVIGATION */}
                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">

                    <button
                        onClick={() => setView("SEARCH")}
                        className={`rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm transition
                        ${view === "SEARCH"
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                    >
                        Search Patients
                    </button>



                    <button
                        onClick={() => setView("ADD")}
                        className={`rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm transition
                        ${view === "ADD"
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                    >
                        Add Patient
                    </button>



                    <button
                        onClick={() => setView("ANALYSIS")}
                        className={`rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm transition
                        ${view === "ANALYSIS"
                                ? "bg-purple-600 text-white"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                    >
                        Patients Analysis
                    </button>

                    <button
                        onClick={() => {
                            setView("UPCOMING");
                            loadUpcomingAppointments();
                        }}
                        className={`rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm transition
                        ${view === "UPCOMING"
                                ? "bg-cyan-700 text-white"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            }`}
                    >
                        Upcoming Appointments
                    </button>

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
                                                        Patient ID
                                                    </th>

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

                                                                {p.id}

                                                            </td>

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
                                                                        onClick={() => {
                                                                            const includeMedicineBill = window.confirm("Include medicine bill PDF in the downloaded report?");
                                                                            downloadPatientPDF(p, { includeMedicineBill }).catch(() => alert("Failed to generate PDF"));
                                                                        }}
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


            {/* UPCOMING APPOINTMENTS VIEW */}
            {
                view === "UPCOMING" && (

                    <div className="bg-white border border-slate-200 shadow-lg rounded-3xl overflow-hidden">
                        <div className="flex flex-col gap-4 border-b bg-white/70 px-6 py-5 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-700">
                                    Upcoming Appointments
                                </h2>
                                <p className="mt-2 text-sm text-slate-500">
                                    Patients sorted by their next follow-up appointment date.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={loadUpcomingAppointments}
                                className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700"
                            >
                                Refresh
                            </button>
                        </div>

                        {loadingAppointments ? (

                            <div className="p-8 text-center text-slate-500">
                                Loading upcoming appointments...
                            </div>

                        ) : upcomingAppointments.length === 0 ? (

                            <div className="p-8 text-center text-slate-500">
                                No upcoming follow-up appointments found.
                            </div>

                        ) : (

                            <div className="overflow-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-100/80">
                                        <tr>
                                            <th className="text-left px-5 py-3 text-slate-700 font-semibold text-sm md:text-base">
                                                Patient ID
                                            </th>
                                            <th className="text-left px-5 py-3 text-slate-700 font-semibold text-sm md:text-base">
                                                Follow-up Date
                                            </th>
                                            <th className="text-left px-5 py-3 text-slate-700 font-semibold text-sm md:text-base">
                                                Patient Name
                                            </th>
                                            <th className="text-left px-5 py-3 text-slate-700 font-semibold text-sm md:text-base">
                                                Mobile Number
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {upcomingAppointments.map((appointment) => (

                                            <tr
                                                key={appointment.patient_id}
                                                className="border-t border-slate-200 hover:bg-blue-50/70 transition-all"
                                            >
                                                <td className="px-5 py-4 text-slate-700 font-semibold text-sm md:text-base">
                                                    {appointment.patient_id}
                                                </td>
                                                <td className="px-5 py-4 text-slate-700 font-semibold text-sm md:text-base">
                                                    {formatAppointmentDate(appointment.followup_date)}
                                                </td>
                                                <td className="px-5 py-4 text-slate-700 font-semibold text-sm md:text-base">
                                                    {appointment.first_name} {appointment.last_name}
                                                </td>
                                                <td className="px-5 py-4 text-slate-600 text-sm md:text-base">
                                                    {appointment.mobile}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
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

        </div>
    );
}
