// uploadMiddleware.js
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Direktori tempat menyimpan gambar
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname); // Mendapatkan ekstensi file asli
    cb(null, file.fieldname + '-' + uniqueSuffix + extension); // Nama file yang disimpan
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Pastikan file yang diunggah adalah gambar
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // Batasan ukuran file (misalnya 5MB)
  },
});

module.exports = upload;
