const multer = require("multer");

const path = require("path");


// STORAGE CONFIG
const storage = multer.diskStorage({

    destination: function(req, file, cb) {

        cb(null, "uploads/prescriptions/");
    },

    filename: function(req, file, cb) {

        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1E9);

        cb(
            null,
            uniqueName + path.extname(file.originalname)
        );
    }
});



// FILE FILTER
const fileFilter = (req, file, cb) => {

    const imageTypes = /jpeg|jpg|png/;
    const pdfTypes = /pdf/;

    const extension = path.extname(file.originalname).toLowerCase();
    const isImage = imageTypes.test(extension);
    const isPdf = pdfTypes.test(extension);

    if (file.fieldname === "medicine_bill") {
        if (isImage && imageTypes.test(file.mimetype)) {
            return cb(null, true);
        }
        return cb("Only JPG, JPEG, PNG files allowed for medicine bills");
    }

    if (isImage && imageTypes.test(file.mimetype)) {
        return cb(null, true);
    }

    cb("Only JPG, JPEG, PNG allowed for image uploads");
};



// UPLOAD CONFIG
const upload = multer({

    storage: storage,

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: fileFilter
});


module.exports = upload;