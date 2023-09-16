const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../uploads')); // Specify the upload directory
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`); // Define file naming
    },
});

const upload = multer({ 
    storage: storage ,
    limits: {
        fileSize: 1 * 1000000, // 1MB
    },
    fileFilter: function (req, file, cb) {
        let ext = path.extname(file.originalname)
        if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
            return cb("Only images are allowed")
        }
        cb(null, true)
    }
});

module.exports = { upload }