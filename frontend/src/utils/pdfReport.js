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

const formatVisitDateTime = (visit) => {
    const timestamp = visit?.created_at || visit?.visit_date;
    if (!timestamp) return "";

    const normalized = timestamp.replace(" ", "T");
    const date = new Date(normalized);
    if (Number.isNaN(date.getTime())) {
        return visit.visit_date || "";
    }

    const datePart = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    });
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" }).toLowerCase();
    const timePart = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });

    return `${datePart} · ${weekday} · ${timePart}`;
};

const getImageDimensions = (dataUrl) => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve({ width: image.width, height: image.height });
        image.onerror = reject;
        image.src = dataUrl;
    });
};

const ensurePageSpace = (doc, currentY, requiredHeight = 110) => {
    if (currentY + requiredHeight > 280) {
        doc.addPage();
        return 20;
    }
    return currentY;
};

export const downloadPatientPDF = async (patient, options = {}) => {
    const { includeMedicineBill = false } = options;

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
            ["Patient ID", patient.id],
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
            ? visits.map((opd) => [formatVisitDateTime(opd), opd.diagnosis || "", opd.medicines || ""])
            : [["No OPD Records", "", ""]]
    });

    currentY = doc.lastAutoTable.finalY + 15;

    if (visits.length > 0) {
        for (const opd of visits) {
            const visitLabel = formatVisitDateTime(opd)
                ? `Visit Date: ${formatVisitDateTime(opd)}`
                : `Visit ${opd.id}`;

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

            if (includeMedicineBill && opd.medicine_bill) {
                const billUrl = resolveApiImageUrl(opd.medicine_bill);

                try {
                    const imgData = await getBase64FromUrl(billUrl);
                    const format = getImageFormat(imgData);
                    const { width: originalWidth, height: originalHeight } = await getImageDimensions(imgData);
                    const maxWidth = 180;
                    const displayHeight = (originalHeight / originalWidth) * maxWidth;

                    currentY = ensurePageSpace(doc, currentY, displayHeight + 30);
                    doc.setFontSize(15);
                    doc.text(`Medicine Bill (${visitLabel})`, 14, currentY);
                    currentY += 10;
                    doc.addImage(imgData, format, 14, currentY, maxWidth, displayHeight);
                    currentY += displayHeight + 10;
                } catch (error) {
                    console.error("Failed to attach medicine bill image to PDF", error);
                    currentY = ensurePageSpace(doc, currentY, 50);
                    doc.setFontSize(15);
                    doc.text(`Medicine Bill (${visitLabel})`, 14, currentY);
                    currentY += 10;
                    doc.setFontSize(12);
                    doc.text(`Unable to attach medicine bill image`, 14, currentY);
                    currentY += 12;
                }
            }
        }
    }

    doc.save(`${patient.first_name}_${patient.last_name}_report.pdf`);
};
