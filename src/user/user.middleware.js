// src/middleware/upload.middleware.js
const multer = require('multer');
const path = require('path');

const fs = require('fs');

// Pastikan folder `uploads/excel` ada
const uploadDir = path.join(__dirname, '../uploads/excel');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware untuk file Excel
const excelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}${extension}`);
  }
});

const excelFileFilter = (req, file, cb) => {
  const allowedTypes = ['.xlsx', '.xls'];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Only Excel files are allowed!'), false);
  }
};

const uploadExcel = multer({
  storage: excelStorage,
  fileFilter: excelFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
  }
});
// Middleware untuk gambar
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads/users"); // Direktori tempat menyimpan gambar
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extension = path.extname(file.originalname); // Mendapatkan ekstensi file asli
      const nisn = req.body.NIS; 
      cb(null, nisn + extension); 
    },
  });
  
  
  const uploadImage = multer({
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

module.exports = {
  uploadExcel,
  uploadImage,
};