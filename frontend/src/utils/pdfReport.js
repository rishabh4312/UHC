import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { getPatientOpdHistory } from "../services/opdService";
import { getPrescriptionsByVisit } from "../services/prescriptionService";

const resolveApiImageUrl = (src) => {
    if (!src) return src;
    if (src.startsWith("http") || src.startsWith("blob:")) {
        return src;
    }
    const normalized = src.replace(/\\/g, "/").replace(/^\/+/, "");
    return `http://localhost:5000/${normalized}`;
};

const getBase64FromUrl = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const getImageFormat = (dataUrl) => {
    if (!dataUrl) return "JPEG";
    if (dataUrl.startsWith("data:image/png")) return "PNG";
    if (dataUrl.startsWith("data:image/webp")) return "WEBP";
    return "JPEG";
};

const ensurePageSpace = (doc, currentY, requiredHeight = 110) => {
    if (currentY + requiredHeight > 280) {
        doc.addPage();
        return 20;
    }
    return currentY;
};

export const downloadPatientPDF = async (patient) => {
    if (!patient || !patient.id) {
        throw new Error("Patient data is required to generate PDF");
    }

    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("Uday Health Care", 14, 20);
    doc.setFontSize(14);
    doc.text("Neurology Clinic Patient Report", 14, 30);

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

    let visits = patient.opd_visits?.length > 0 ? patient.opd_visits : [];

    if (visits.length === 0) {
        const historyResponse = await getPatientOpdHistory(patient.id);
        if (historyResponse.success) {
            visits = historyResponse.data || [];
        }
    }

    doc.setFontSize(16);
    doc.text("OPD Details", 14, currentY);
    currentY += 10;

    autoTable(doc, {
        startY: currentY,
        head: [["Date", "Diagnosis", "Prescription"]],
        body: visits.length > 0
            ? visits.map((opd) => [opd.visit_date || "", opd.diagnosis || "", opd.medicines || ""])
            : [["No OPD Records", "", ""]]
    });

    currentY = doc.lastAutoTable.finalY + 15;

    if (visits.length > 0) {
        for (const opd of visits) {
            const visitLabel = opd.visit_date ? `Visit Date: ${opd.visit_date}` : `Visit ${opd.id}`;

            const prescriptionsResponse = await getPrescriptionsByVisit(opd.id);
            const prescriptions = prescriptionsResponse.success ? prescriptionsResponse.data || [] : [];

            if (prescriptions.length > 0) {
                currentY = ensurePageSpace(doc, currentY, 100);
                doc.setFontSize(15);
                doc.text(`Prescription Images (${visitLabel})`, 14, currentY);
                currentY += 10;

                for (const prescription of prescriptions) {
                    if (!prescription.image_path) continue;
                    const imageUrl = resolveApiImageUrl(prescription.image_path);

                    try {
                        if (currentY > 230) {
                            doc.addPage();
                            currentY = 20;
                        }

                        const imgData = await getBase64FromUrl(imageUrl);
                        const format = getImageFormat(imgData);

                        doc.addImage(imgData, format, 14, currentY, 80, 80);
                        currentY += 90;
                    } catch (error) {
                        console.error("Failed to attach prescription image to PDF", error);
                    }
                }
            }

            if (opd.lab_report) {
                const imageUrl = resolveApiImageUrl(opd.lab_report);

                try {
                    currentY = ensurePageSpace(doc, currentY, 120);
                    doc.setFontSize(15);
                    doc.text(`Lab Report (${visitLabel})`, 14, currentY);
                    currentY += 10;

                    const imgData = await getBase64FromUrl(imageUrl);
                    const format = getImageFormat(imgData);

                    doc.addImage(imgData, format, 14, currentY, 100, 100);
                    currentY += 110;
                } catch (error) {
                    console.error("Failed to attach lab report image to PDF", error);
                }
            }
        }
    }

    doc.save(`${patient.first_name}_${patient.last_name}_report.pdf`);
};
