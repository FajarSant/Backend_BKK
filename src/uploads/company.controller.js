// File: pengguna.controller.js

const express = require('express');
const router = express.Router();
const { CreatePengguna } = require('./company.service');
const multer = require('multer');
const path = require('path');

// Middleware untuk menangani pengunggahan gambar dengan multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Direktori tempat menyimpan gambar
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname); // Mendapatkan ekstensi file asli
    cb(null, file.fieldname + '-' + uniqueSuffix + extension); // Nama file yang disimpan
  },
});

// Membuat middleware upload dengan konfigurasi storage
const upload = multer({ storage: storage });

// Middleware untuk mengizinkan akses ke direktori uploads
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route untuk upload gambar dan membuat pengguna baru
router.post('/create', upload.single('gambar'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send('Mohon unggah file');
    }

    const imageUrl = `http://localhost:2000/uploads/${file.filename}`; // URL gambar yang akan disimpan di basis data

    // Contoh menyimpan data pengguna ke Prisma dengan URL gambar
    const newUserData = {
      email: req.body.email,
      kataSandi: req.body.kataSandi,
      nama: req.body.nama,
      alamat: req.body.alamat,
      nomortelepon: req.body.nomortelepon,
      gambar: imageUrl, // Simpan URL gambar di basis data
      peran: req.body.peran,
      jurusan: req.body.jurusan,
    };

    const newUser = await CreatePengguna(newUserData);

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).send('Gagal mengunggah gambar');
  }
});

module.exports = router;
