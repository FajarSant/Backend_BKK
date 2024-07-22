const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/lamaran"); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    
    // Validasi dan penanganan email dan namaPT
    const namaPT = req.body.namaPT ? req.body.namaPT.replace(/\s+/g, '_') : 'defaultPT';
    cb(null, `${namaPT}_${extension}`);
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
    fileSize: 1024 * 1024 * 5, 
  },
});

const cleanAndParseArrayString = (inputString) => {
    if (!inputString) return [];
    
    try {
      // Menghilangkan karakter backslash dan tanda kutip yang tidak diperlukan
      const cleanedString = inputString
        .replace(/\\+/g, '') // Menghapus semua backslash
        .replace(/^\[|\]$/g, '') // Menghapus tanda kurung pada awal dan akhir string
        .split(/","|",\s*"/) // Membagi string berdasarkan pemisah yang sesuai
        .map(item => item.replace(/\"/g, '')); // Menghapus tanda kutip di sekitar elemen
      
      return cleanedString;
    } catch (error) {
      console.error("Error parsing array string:", error);
      return [];
    }
  };
module.exports = {
  uploadImage,
  cleanAndParseArrayString
};
