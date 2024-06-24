// server.js

const express = require('express');
const upload = require('./uploads/upload.middleware');
const prisma = require('./db');

const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware untuk mengizinkan akses ke direktori uploads
app.use('./uploads', express.static(path.join(__dirname, 'uploads')));

// Endpoint untuk upload gambar
app.post('/api/users', upload.single('gambar'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send('Mohon unggah file');
    }

    // Lakukan sesuai kebutuhan, seperti menyimpan URL gambar di basis data
    const imageUrl = `http://localhost:${PORT}/uploads/${file.filename}`;

    // Simpan data pengguna ke basis data menggunakan Prisma
    const newUser = await prisma.pengguna.create({
      data: {
        email: req.body.email,
        kataSandi: req.body.kataSandi,
        nama: req.body.nama,
        alamat: req.body.alamat,
        nomortelepon: req.body.nomortelepon,
        gambar: imageUrl,
        peran: req.body.peran,
        jurusan: req.body.jurusan,
      },
    });

    res.status(201).json({ imageUrl: imageUrl, newUser: newUser });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).send('Gagal mengunggah gambar');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
