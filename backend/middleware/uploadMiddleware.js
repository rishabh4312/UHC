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

    const allowedTypes = /jpeg|jpg|png/;

    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );

    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {

        return cb(null, true);

    } else {

        cb("Only JPG, JPEG, PNG allowed");
    }
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