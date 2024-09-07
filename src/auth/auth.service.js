const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../db");

require("dotenv").config(); // Menggunakan dotenv untuk membaca variabel lingkungan

// Fungsi untuk autentikasi pengguna berdasarkan NIS dan password
async function authenticateUser(nis, password) {
  try {
    // Cari user berdasarkan NIS
    const user = await prisma.pengguna.findUnique({ where: { NIS: nis } });

    // Jika user tidak ditemukan, kirimkan pesan error
    if (!user) {
      throw new Error("NIS tidak ditemukan");
    }

    // Bandingkan password yang diterima dengan password yang di-hash di database
    const passwordMatch = await bcrypt.compare(password, user.katasandi);

    // Jika password tidak cocok, kirimkan pesan error
    if (!passwordMatch) {
      throw new Error("Password salah");
    }

    // Buat token JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "29d", // Masa berlaku token 1 jam
    });

    // Kirim token dan data user
    return { token, user };
  } catch (error) {
    // Tangani error dengan melempar error ke atas
    throw new Error(error.message);
  }
}

module.exports = {
  authenticateUser,
};
