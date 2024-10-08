const express = require("express");
const { authenticateUser } = require("./auth.service");
const jwt = require("jsonwebtoken");
const prisma = require("../db");

const router = express.Router();

// Endpoint untuk proses login
router.post("/login", async (req, res) => {
  try {
    const { nis, katasandi } = req.body;

    // Pastikan NIS dan katasandi tersedia
    if (!nis || !katasandi) {
      throw new Error("NIS dan kata sandi diperlukan");
    }

    // Panggil fungsi authenticateUser untuk verifikasi user
    const { token, user } = await authenticateUser(nis, katasandi);

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
        NIS: true,
        peran: true,
        jurusan: true,
        lamaran: {
          select: {
            id: true,
            pekerjaan: {
              select: {
                id: true,
                namaPT: true,
                deadline: true,
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
                namaPT: true,
                deadline: true,

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
