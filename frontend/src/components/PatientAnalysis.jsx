import { useEffect, useState } from "react";

import jsPDF from "jspdf";

import { autoTable } from "jspdf-autotable";

import {
    getPatientsByStatus
} from "../services/patientService";



export default function PatientAnalysis({

    onOpenOPD,

    onEdit

}) {

    const [patients, setPatients] = useState([]);

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



    // ==========================================
    // IMAGE TO BASE64
    // ==========================================
    const getBase64FromUrl = async (url) => {

        const data = await fetch(url);

        const blob = await data.blob();

        return new Promise((resolve) => {

            const reader = new FileReader();

            reader.readAsDataURL(blob);

            reader.onloadend = () => {
                resolve(reader.result);
            };
        });
    };



    // ==========================================
    // DOWNLOAD SINGLE PATIENT PDF
    // ==========================================
    const downloadPatientPDF = async (patient) => {

        const doc = new jsPDF();



        // ======================================
        // TITLE
        // ======================================
        doc.setFontSize(22);

        doc.text("Uday Health Care", 14, 20);

        doc.setFontSize(14);

        doc.text("Neurology Clinic Patient Report", 14, 30);



        // ======================================
        // PATIENT INFO TABLE
        // ======================================
        autoTable(doc, {
            startY: 40,
            head: [["Field", "Value"]],
            body: [
                ["Patient Name", `${patient.first_name} ${patient.last_name}`],
                ["Mobile", patient.mobile || ""],
                ["Age", patient.age || ""],
                ["Gender", patient.gender || ""],
                ["Treatment Status", patient.treatment_status || ""],
                ["Treatment Start", patient.treatment_start_date || ""],
                ["Treatment End", patient.treatment_end_date || ""],
            ]
        });



        let currentY = doc.lastAutoTable.finalY + 15;



        // ======================================
        // OPD DETAILS
        // ======================================
        doc.setFontSize(16);

        doc.text("OPD Details", 14, currentY);

        currentY += 10;



        autoTable(doc, {
            startY: currentY,
            head: [["Date", "Diagnosis", "Prescription"]],
            body: patient.opd_visits?.map((opd) => ([
                opd.visit_date || "",
                opd.diagnosis || "",
                opd.prescription || ""
            ])) || [["No OPD Records", "", ""]]
        });



        currentY = doc.lastAutoTable.finalY + 15;



        // ======================================
        // PRESCRIPTION IMAGES
        // ======================================
        if (
            patient.opd_visits &&
            patient.opd_visits.length > 0
        ) {

            for (const opd of patient.opd_visits) {

                if (opd.prescription_image) {

                    try {

                        if (currentY > 230) {

                            doc.addPage();

                            currentY = 20;
                        }



                        doc.setFontSize(15);

                        doc.text(
                            "Prescription Image",
                            14,
                            currentY
                        );

                        currentY += 10;



                        const imgData =
                            await getBase64FromUrl(
                                opd.prescription_image
                            );



                        doc.addImage(
                            imgData,
                            "JPEG",
                            14,
                            currentY,
                            80,
                            80
                        );



                        currentY += 90;

                    } catch (err) {

                        console.error(
                            "Prescription image failed",
                            err
                        );
                    }
                }
            }
        }



        // ======================================
        // LAB REPORTS
        // ======================================
        if (
            patient.lab_reports &&
            patient.lab_reports.length > 0
        ) {

            for (const report of patient.lab_reports) {

                try {

                    if (currentY > 230) {

                        doc.addPage();

                        currentY = 20;
                    }



                    doc.setFontSize(15);

                    doc.text(
                        "Lab Report",
                        14,
                        currentY
                    );

                    currentY += 10;



                    const imgData =
                        await getBase64FromUrl(
                            report.image_url
                        );



                    doc.addImage(
                        imgData,
                        "JPEG",
                        14,
                        currentY,
                        100,
                        100
                    );



                    currentY += 110;

                } catch (err) {

                    console.error(
                        "Lab report image failed",
                        err
                    );
                }
            }
        }



        // ======================================
        // SAVE PDF
        // ======================================
        doc.save(
            `${patient.first_name}_${patient.last_name}_report.pdf`
        );
    };



    return (

        <div className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-2xl rounded-[32px] p-8 mt-4">

            {/* HEADER */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">

                <h2 className="text-3xl font-bold text-slate-700">

                    {title}

                </h2>

            </div>



            {/* FILTERS */}
            <div className="flex gap-3 mb-6 flex-wrap">

                <button
                    onClick={() => loadPatients("ALL")}
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 py-3 rounded-2xl font-semibold shadow-lg"
                >
                    All Patients
                </button>



                <button
                    onClick={() =>
                        loadPatients("UNDER_TREATMENT")
                    }
                    className="bg-gradient-to-r from-orange-500 to-amber-600 text-white px-5 py-3 rounded-2xl font-semibold shadow-lg"
                >
                    Under Treatment
                </button>



                <button
                    onClick={() =>
                        loadPatients("COMPLETED")
                    }
                    className="bg-gradient-to-r from-green-500 to-emerald-700 text-white px-5 py-3 rounded-2xl font-semibold shadow-lg"
                >
                    Completed
                </button>

            </div>



            {/* TABLE */}
            <div className="overflow-auto rounded-3xl border border-slate-200">

                <table className="w-full">

                    <thead className="bg-slate-100">

                        <tr>

                            <th className="text-left px-6 py-4 font-bold text-slate-700">
                                Name
                            </th>

                            <th className="text-left px-6 py-4 font-bold text-slate-700">
                                Mobile
                            </th>

                            <th className="text-left px-6 py-4 font-bold text-slate-700">
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

                                    <td className="px-6 py-4 text-slate-700 font-medium">
                                        {p.first_name} {p.last_name}
                                    </td>

                                    <td className="px-6 py-4 text-slate-600">
                                        {p.mobile}
                                    </td>

                                    <td className="px-6 py-4">

                                        <div className="flex gap-3 flex-wrap">

                                            {/* OPD */}
                                            <button
                                                onClick={() =>
                                                    onOpenOPD(p)
                                                }
                                                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-xl font-semibold shadow-md"
                                            >
                                                OPD
                                            </button>



                                            {/* EDIT */}
                                            <button
                                                onClick={() =>
                                                    onEdit(p)
                                                }
                                                className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-5 py-2 rounded-xl font-semibold shadow-md"
                                            >
                                                Edit
                                            </button>



                                            {/* PDF */}
                                            <button
                                                onClick={() =>
                                                    downloadPatientPDF(p)
                                                }
                                                className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-5 py-2 rounded-xl font-semibold shadow-md"
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
    );
}