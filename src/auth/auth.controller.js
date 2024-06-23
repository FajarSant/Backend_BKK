const express = require('express');
const { authenticateUser, registerUser } = require('./auth.service');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const prisma = require("../db");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Direktori penyimpanan gambar di server
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Nama file unik
  }
});

const upload = multer({ storage: storage });

// Endpoint untuk mengunggah gambar
router.post('/upload', upload.single('gambar'), async (req, res) => {
  try {
    const { penggunaId } = req.body; // Ambil id pengguna dari body request

    // Simpan path gambar ke database (misalnya, menggunakan Prisma)
    const updatedUser = await prisma.pengguna.update({
      where: { id: parseInt(penggunaId) },
      data: {
        gambar: req.file.path // Simpan path gambar dari req.file.path
      }
    });

    res.json({ message: 'Gambar berhasil diunggah', user: updatedUser });
  } catch (error) {
    console.error('Error saat mengunggah gambar:', error);
    res.status(500).json({ error: 'Gagal mengunggah gambar' });
  }
});


router.post('/register', async (req, res) => {
  try {
    const { email, kataSandi, nama, alamat, nomortelepon, gambar, peran, jurusan } = req.body;
    const token = await registerUser({ email, kataSandi, nama, alamat, nomortelepon, gambar, peran, jurusan });
    res.status(201).json(token);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, kataSandi } = req.body;
    const token = await authenticateUser(email, kataSandi);
    res.json(token);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

router.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'This is a protected resource', user: req.user });
});

router.get('/me', authenticateJWT, async (req, res) => {
  try {
    const user = await prisma.pengguna.findUnique({
      where: {
        id: req.user.userId,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
