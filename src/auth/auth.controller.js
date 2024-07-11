const express = require("express");
const { authenticateUser, registerUser } = require("./auth.service");
const jwt = require("jsonwebtoken");
const upload = require("../middleware/upload.middleware");
const prisma = require("../db");

const router = express.Router();

// Endpoint untuk register pengguna dan upload gambar
router.post("/register", upload.single("gambar"), async (req, res) => {
  try {
    const { email, kataSandi, nama, alamat, nomortelepon, peran, jurusan, nis } = req.body;

    // Validasi data yang diterima
    if (!email || !kataSandi || !nama || !alamat || !nomortelepon || !peran || !jurusan || !nis) {
      throw new Error("Semua field harus diisi");
    }

    let gambarPath = null;
    if (req.file) {
      gambarPath = req.file.path;
    }

    // Panggil fungsi registerUser untuk membuat pengguna baru
    const { token, user } = await registerUser({
      email,
      kataSandi,
      nama,
      alamat,
      nomortelepon,
      gambar: gambarPath,
      peran,
      jurusan,
      nis, // Tambahkan NIS ke data registrasi
    });

    // Kirim respons dengan token dan data user
    res.status(201).json({ token, user });
  } catch (error) {
    // Tangani error dengan memberikan respons status 400 dan pesan error
    res.status(400).json({ error: error.message });
  }
});

// Endpoint untuk proses login
router.post("/login", async (req, res) => {
  try {
    const { nis, kataSandi } = req.body;

    // Pastikan NIS dan kataSandi tersedia
    if (!nis || !kataSandi) {
      throw new Error("NIS dan kata sandi diperlukan");
    }

    // Panggil fungsi authenticateUser untuk verifikasi user
    const { token, user } = await authenticateUser(nis, kataSandi);

    // Kirim respons dengan token dan data user
    res.json({ token, user });
  } catch (error) {
    // Tangani error dengan memberikan respons status 400 dan pesan error
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
        lamaran: {
          select: {
            id: true,
            pekerjaan: {
              select: {
                id: true,
                judul: true,
              },
            },
            status: true,
            tanggalDibuat: true,
          },
        },
        lowonganTersimpan: {
          select: {
            id: true,
            pekerjaan: {
              select: {
                id: true,
                judul: true,
              },
            },
          },
        },
      },
    });

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
