from pathlib import Path

path = Path('backend/controllers/prescriptionController.js')
text = path.read_text(encoding='utf-8')
old = 'module.exports = {\n    uploadPrescription,\n    getPrescriptionsByVisit\n};\n'
new = '''const uploadLabReport = (req, res) => {

    try {

        const {
            patient_id,
            visit_id
        } = req.body;

        if (!req.file) {

            return res.status(400).json({
                success: false,
                message: "No lab report uploaded"
            });
        }

        const imagePath = req.file.path;

        const sql = `
            UPDATE opd_visits
            SET lab_report = ?
            WHERE id = ?
        `;

        db.run(
            sql,
            [
                imagePath,
                visit_id
            ],
            function(err) {

                if (err) {

                    console.log(err.message);

                    return res.status(500).json({
                        success: false,
                        message: "Database error"
                    });
                }

                res.status(200).json({
                    success: true,
                    message: "Lab report uploaded successfully",
                    image_path: imagePath
                });
            }
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};


module.exports = {
    uploadPrescription,
    uploadLabReport,
    getPrescriptionsByVisit
};
'''
if old not in text:
    raise SystemExit('pattern not found')
path.write_text(text.replace(old, new), encoding='utf-8')
print('patched')
