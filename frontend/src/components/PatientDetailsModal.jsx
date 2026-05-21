import { useEffect, useState } from "react";

import {
    addOpdVisit,
    getPatientOpdHistory
} from "../services/opdService";

import {
    getPrescriptionsByVisit,
    uploadPrescription,
    uploadLabReport
} from "../services/prescriptionService";

export default function PatientDetailsModal({
    patient,
    mode = "VIEW",
    onClose
}) {
    const [opdHistory, setOpdHistory] = useState([]);
    const [visitPrescriptions, setVisitPrescriptions] = useState({});
    const [activeTab, setActiveTab] = useState(mode);
    const [formData, setFormData] = useState({
        symptoms: "",
        diagnosis: "",
        medicines: "",
        notes: "",
        visit_date: new Date().toISOString().split("T")[0]
    });
    const [prescriptionImage, setPrescriptionImage] = useState(null);
    const [prescriptionFile, setPrescriptionFile] = useState(null);
    const [labReport, setLabReport] = useState(null);
    const [labReportFile, setLabReportFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [previewTitle, setPreviewTitle] = useState("");
    const [activeVisitId, setActiveVisitId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const toggleVisitDetails = (visitId) => {
        setActiveVisitId((current) => (current === visitId ? null : visitId));
    };

    const loadVisitPrescriptions = async (visitId) => {
        try {
            const response = await getPrescriptionsByVisit(visitId);
            if (response.success) {
                setVisitPrescriptions((prev) => ({
                    ...prev,
                    [visitId]: response.data || []
                }));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const loadHistory = async () => {
        if (!patient?.id) {
            return;
        }

        setLoadingHistory(true);

        try {
            const response = await getPatientOpdHistory(patient.id);

            if (response.success) {
                const historyData = response.data || [];
                setOpdHistory(historyData);
                await Promise.all(historyData.map((visit) => loadVisitPrescriptions(visit.id)));
            } else {
                setOpdHistory([]);
            }
        } catch (error) {
            console.error(error);
            setOpdHistory([]);
        } finally {
            setLoadingHistory(false);
        }
    };

    useEffect(() => {
        if (patient) {
            loadHistory();
        }
    }, [patient]);

    useEffect(() => {
        setActiveTab(mode || "VIEW");
    }, [mode]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePrescriptionUpload = (e) => {
        const file = e.target.files[0];

        if (file) {
            setPrescriptionFile(file);
            setPrescriptionImage(URL.createObjectURL(file));
        }
    };

    const handleLabReportUpload = (e) => {
        const file = e.target.files[0];

        if (file) {
            setLabReportFile(file);
            setLabReport(URL.createObjectURL(file));
        }
    };

    const resolveApiImageUrl = (src) => {
        if (!src) return src;
        if (src.startsWith("http") || src.startsWith("blob:")) {
            return src;
        }
        const normalized = src.replace(/\\/g, "/").replace(/^\/+/, "");
        return `http://localhost:5000/${normalized}`;
    };

    const openPreview = (url, title) => {
        setPreviewImage(url);
        setPreviewTitle(title);
    };

    const closePreview = () => {
        setPreviewImage(null);
        setPreviewTitle("");
    };

    const handleSave = async () => {
        if (!patient?.id) {
            alert("Patient not selected");
            return;
        }

        setSaving(true);

        try {
            const response = await addOpdVisit({
                patient_id: patient.id,
                doctor_name: "",
                symptoms: formData.symptoms,
                diagnosis: formData.diagnosis,
                notes: formData.notes,
                medicines: formData.medicines,
                visit_date: formData.visit_date,
            });

            if (response.success) {
                const visitId = response.visit_id;

                if (prescriptionFile) {
                    const formDataToUpload = new FormData();
                    formDataToUpload.append("patient_id", patient.id);
                    formDataToUpload.append("visit_id", visitId);
                    formDataToUpload.append("prescription", prescriptionFile);
                    await uploadPrescription(formDataToUpload);
                }

                if (labReportFile) {
                    const formDataToUpload = new FormData();
                    formDataToUpload.append("patient_id", patient.id);
                    formDataToUpload.append("visit_id", visitId);
                    formDataToUpload.append("lab_report", labReportFile);
                    await uploadLabReport(formDataToUpload);
                }

                await loadHistory();

                setFormData({
                    symptoms: "",
                    diagnosis: "",
                    medicines: "",
                    notes: "",
                    visit_date: new Date().toISOString().split("T")[0]
                });
                setPrescriptionImage(null);
                setPrescriptionFile(null);
                setLabReport(null);
                setLabReportFile(null);
                setActiveTab("VIEW");
                alert("OPD Visit saved successfully");
            } else {
                alert(response.message || "Failed to save OPD visit");
            }
        } catch (error) {
            console.error(error);
            alert("Error saving OPD visit");
        } finally {
            setSaving(false);
        }
    };

    if (!patient) return null;

    const lastVisitDate = opdHistory?.[0]?.visit_date || "No visits yet";
    const totalVisits = opdHistory.length;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3 overflow-auto">
            <div className="bg-white rounded-[30px] shadow-2xl w-full max-w-[92rem] overflow-hidden border border-slate-200">
                <div className="bg-slate-950 text-white p-6 md:p-7 grid gap-6 lg:grid-cols-[1fr_auto] items-start">
                    <div>
                        <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Patient details</p>
                        <h2 className="mt-3 text-3xl font-semibold tracking-tight">{patient.first_name} {patient.last_name}</h2>
                        <p className="mt-2 max-w-2xl text-sm text-slate-300">Review OPD history, upload visit records and preview attachments in one smooth workspace.</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                        <div className="rounded-3xl bg-white/8 border border-white/10 px-4 py-3 text-center">
                            <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Visits</div>
                            <div className="mt-2 text-2xl font-semibold">{totalVisits}</div>
                        </div>
                        <div className="rounded-3xl bg-white/8 border border-white/10 px-4 py-3 text-center">
                            <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Latest</div>
                            <div className="mt-2 text-sm font-semibold">{lastVisitDate}</div>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:border-slate-500 hover:bg-slate-800"
                        >
                            Close
                        </button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[320px_1fr] p-6 md:p-7">
                    <aside className="space-y-5 rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">Contact</p>
                            <p className="mt-2 text-lg font-semibold text-slate-800">{patient.mobile}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">Age</p>
                            <p className="mt-2 text-lg font-semibold text-slate-800">{patient.age}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">Gender</p>
                            <p className="mt-2 text-lg font-semibold text-slate-800">{patient.gender}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                            <p className="text-sm text-slate-500">Current Status</p>
                            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-700">
                                <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                                Active Patient
                            </div>
                        </div>
                    </aside>

                    <section className="space-y-6">
                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("VIEW")}
                                    className={`rounded-full px-5 py-2 text-sm font-semibold transition ${activeTab === "VIEW" ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                                >
                                    OPD History
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("ADD")}
                                    className={`rounded-full px-5 py-2 text-sm font-semibold transition ${activeTab === "ADD" ? "bg-indigo-600 text-white shadow-lg" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                                >
                                    New Visit
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={loadHistory}
                                    className="rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                                >
                                    Refresh
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("ADD")}
                                    className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                >
                                    Add Visit
                                </button>
                            </div>
                        </div>

                        {activeTab === "VIEW" ? (
                            <div className="space-y-5">
                                {loadingHistory ? (
                                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">Loading history...</div>
                                ) : opdHistory.length === 0 ? (
                                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">No OPD visits recorded yet.</div>
                                ) : (
                                    <div className="space-y-4">
                                        {opdHistory.map((opd) => (
                                            <article key={opd.id} className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden">
                                                <div className="flex items-center justify-between gap-4 p-5 cursor-pointer hover:bg-slate-50 transition" onClick={() => toggleVisitDetails(opd.id)}>
                                                    <div>
                                                        <p className="text-sm text-slate-500">Visit date</p>
                                                        <p className="text-xl font-semibold text-slate-900">{opd.visit_date}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-slate-500">Status</p>
                                                        <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">{activeVisitId === opd.id ? "Open" : "Collapsed"}</span>
                                                    </div>
                                                </div>
                                                <div className={`${activeVisitId === opd.id ? "block" : "hidden"} border-t border-slate-200 bg-slate-50 p-5`}>
                                                    <div className="grid gap-4 lg:grid-cols-2">
                                                        <div className="rounded-3xl bg-white p-4 border border-slate-200 shadow-sm">
                                                            <p className="text-sm text-slate-500">Symptoms</p>
                                                            <p className="mt-2 text-slate-700">{opd.symptoms || "Not available"}</p>
                                                        </div>
                                                        <div className="rounded-3xl bg-white p-4 border border-slate-200 shadow-sm">
                                                            <p className="text-sm text-slate-500">Diagnosis</p>
                                                            <p className="mt-2 text-slate-700">{opd.diagnosis || "Not available"}</p>
                                                        </div>
                                                        <div className="rounded-3xl bg-white p-4 border border-slate-200 shadow-sm">
                                                            <p className="text-sm text-slate-500">Medicines</p>
                                                            <p className="mt-2 text-slate-700">{opd.medicines || "None"}</p>
                                                        </div>
                                                        <div className="rounded-3xl bg-white p-4 border border-slate-200 shadow-sm">
                                                            <p className="text-sm text-slate-500">Notes</p>
                                                            <p className="mt-2 text-slate-700">{opd.notes || "None"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="mt-5 space-y-4">
                                                        {visitPrescriptions[opd.id]?.length > 0 && (
                                                            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                                                                <div className="flex items-center justify-between gap-3 mb-4">
                                                                    <div>
                                                                        <p className="text-sm font-semibold text-slate-700">Prescription Files</p>
                                                                        <p className="text-sm text-slate-500">Tap preview for instant view</p>
                                                                    </div>
                                                                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">{visitPrescriptions[opd.id].length} files</span>
                                                                </div>
                                                                <div className="grid gap-3 md:grid-cols-2">
                                                                    {visitPrescriptions[opd.id].map((prescription, index) => (
                                                                        <div key={prescription.id || `${prescription.image_path}-${index}`} className="rounded-3xl overflow-hidden border border-slate-200">
                                                                            <img src={resolveApiImageUrl(prescription.image_path)} alt="Prescription" className="h-36 w-full object-cover" />
                                                                            <div className="p-4 bg-slate-50">
                                                                                <div className="flex items-center justify-between gap-2">
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => openPreview(resolveApiImageUrl(prescription.image_path), "Prescription Report")}
                                                                                        className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                                                                                    >
                                                                                        Preview
                                                                                    </button>
                                                                                    <a
                                                                                        href={resolveApiImageUrl(prescription.image_path)}
                                                                                        download="prescription-report"
                                                                                        className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                                                                                    >
                                                                                        Download
                                                                                    </a>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {opd.lab_report && (
                                                            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                                                                <div className="flex items-center justify-between gap-3 mb-4">
                                                                    <div>
                                                                        <p className="text-sm font-semibold text-slate-700">Lab Report</p>
                                                                        <p className="text-sm text-slate-500">Live preview and download</p>
                                                                    </div>
                                                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Lab</span>
                                                                </div>
                                                                <div className="rounded-3xl overflow-hidden border border-slate-200">
                                                                    <img src={resolveApiImageUrl(opd.lab_report)} alt="Lab Report" className="h-44 w-full object-cover" />
                                                                    <div className="p-4 bg-slate-50">
                                                                        <div className="flex items-center justify-between gap-2">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => openPreview(resolveApiImageUrl(opd.lab_report), "Lab Report")}
                                                                                className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                                                                            >
                                                                                Preview
                                                                            </button>
                                                                            <a
                                                                                href={resolveApiImageUrl(opd.lab_report)}
                                                                                download="lab-report"
                                                                                className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                                                                            >
                                                                                Download
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                        <div className="mb-5">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Visit Date</label>
                                            <input
                                                type="date"
                                                name="visit_date"
                                                value={formData.visit_date}
                                                onChange={handleChange}
                                                className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                            />
                                        </div>
                                        {[
                                            ["symptoms", "Symptoms"],
                                            ["diagnosis", "Diagnosis"],
                                            ["medicines", "Medicines"],
                                            ["notes", "Additional Notes"]
                                        ].map(([name, label]) => (
                                            <div key={name} className="mb-5">
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
                                                <textarea
                                                    name={name}
                                                    value={formData[name]}
                                                    onChange={handleChange}
                                                    rows={name === "notes" ? 5 : 3}
                                                    className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-5">
                                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                            <div className="flex items-center justify-between gap-3 mb-4">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-700">Prescription</p>
                                                    <p className="text-sm text-slate-500">Upload a prescription image</p>
                                                </div>
                                                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                                                    Select File
                                                    <input type="file" className="hidden" onChange={handlePrescriptionUpload} />
                                                </label>
                                            </div>
                                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 min-h-[180px] flex items-center justify-center text-center">
                                                {prescriptionImage ? (
                                                    <img src={prescriptionImage} alt="Prescription" className="h-full w-full rounded-3xl object-cover" />
                                                ) : (
                                                    <div className="space-y-3 text-slate-500">
                                                        <div className="text-4xl">📄</div>
                                                        <p className="text-sm">No prescription uploaded yet.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                                            <div className="flex items-center justify-between gap-3 mb-4">
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-700">Lab Report</p>
                                                    <p className="text-sm text-slate-500">Upload lab report image</p>
                                                </div>
                                                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700">
                                                    Select File
                                                    <input type="file" className="hidden" onChange={handleLabReportUpload} />
                                                </label>
                                            </div>
                                            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 min-h-[180px] flex items-center justify-center text-center">
                                                {labReport ? (
                                                    <img src={labReport} alt="Lab Report" className="h-full w-full rounded-3xl object-cover" />
                                                ) : (
                                                    <div className="space-y-3 text-slate-500">
                                                        <div className="text-4xl">🧪</div>
                                                        <p className="text-sm">No lab report uploaded yet.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-600">
                                    <p className="text-sm font-semibold text-slate-700 mb-3">Upload tips</p>
                                    <ul className="space-y-2 text-sm">
                                        <li>• Use clear images for accurate prescription reference.</li>
                                        <li>• Lab reports are stored with the visit record.</li>
                                        <li>• You can preview attachments after saving the visit.</li>
                                    </ul>
                                </div>
                                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {saving ? "Saving visit..." : "Save OPD Visit"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {previewImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                    <div className="max-w-4xl w-full rounded-[28px] bg-slate-950 shadow-xl overflow-hidden">
                        <div className="flex items-center justify-between bg-slate-900 px-5 py-4 text-white">
                            <div className="text-base font-semibold">{previewTitle}</div>
                            <button
                                type="button"
                                onClick={closePreview}
                                className="rounded-2xl border border-slate-600 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
                            >
                                Close
                            </button>
                        </div>
                        <div className="bg-slate-900 p-5">
                            <img
                                src={previewImage}
                                alt={previewTitle}
                                className="mx-auto max-h-[75vh] w-full object-contain rounded-3xl"
                            />
                        </div>
                        <div className="flex justify-end gap-3 bg-slate-950 px-5 py-4">
                            <a
                                href={previewImage}
                                download={previewTitle.toLowerCase().replace(/\s+/g, "-")}
                                className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                            >
                                Download
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
