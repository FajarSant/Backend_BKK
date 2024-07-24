const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Menentukan folder tujuan penyimpanan file
      cb(null, "./uploads/pelatihan"); 
    },
    filename: function (req, file, cb) {
      const extension = path.extname(file.originalname);
  
      // Ambil nama pelatihan dari body request
      const namapelatihan = req.body.namapelatihan ? req.body.namapelatihan.replace(/\s+/g, '_') : 'defaultPelatihan';
      
      // Buat nama file dengan suffix unik
      cb(null, `${namapelatihan}${extension}`);
    },
  });
  
  // Middleware upload gambar dengan multer
  const uploadImage = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      // Validasi agar hanya gambar yang diizinkan
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error("Only image files are allowed!"), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 1024 * 1024 * 5, // Maksimum ukuran file 5 MB
    },
  });


module.exports = {
  uploadImage
};
