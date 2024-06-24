// auth.controller.js
const express = require("express");
const { authenticateUser, registerUser } = require("./auth.service");
const jwt = require("jsonwebtoken");
const upload = require("../middleware/upload.middleware");
const prisma = require("../db");

const router = express.Router();

// Endpoint untuk register pengguna dan upload gambar
router.post("/register", upload.single("gambar"), async (req, res) => {
  try {
    const { email, kataSandi, nama, alamat, nomortelepon, peran, jurusan } = req.body;

    if (!email || !kataSandi || !nama || !alamat || !nomortelepon || !peran || !jurusan) {
      throw new Error("Semua field harus diisi");
    }

    let gambarPath = null;
    if (req.file) {
      gambarPath = req.file.path;
    }

    const { token, user } = await registerUser({
      email,
      kataSandi,
      nama,
      alamat,
      nomortelepon,
      gambar: gambarPath,
      peran,
      jurusan,
    });

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint untuk proses login
router.post("/login", async (req, res) => {
  try {
    const { email, kataSandi } = req.body;
    const { token, user } = await authenticateUser(email, kataSandi);
    res.json({ token, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Middleware untuk autentikasi JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

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

// Endpoint untuk mendapatkan data pengguna yang sedang login
router.get("/me", authenticateJWT, async (req, res) => {
  try {
    const user = await prisma.pengguna.findUnique({
      where: {
        id: req.user.userId,
      },
      select: {
        id: true,
        email: true,
        nama: true,
        alamat: true,
        nomortelepon: true,
        gambar: true,
        peran: true,
        jurusan: true,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
