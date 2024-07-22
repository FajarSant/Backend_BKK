const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../db");

require("dotenv").config();

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
      expiresIn: "1h",
    });

    // Kirim token dan data user
    return { token, user };
  } catch (error) {
    // Tangani error dengan melempar error ke atas
    throw new Error(error.message);
  }
}

// Fungsi untuk registrasi pengguna baru
async function registerUser(data) {
  try {
    // Hash password sebelum menyimpan ke database
    const hashedPassword = await bcrypt.hash(data.katasandi, 10);

    // Buat pengguna baru menggunakan Prisma
    const newUser = await prisma.pengguna.create({
      data: {
        email: data.email,
        katasandi: hashedPassword,
        nama: data.nama,
        alamat: data.alamat,
        nomortelepon: data.nomortelepon,
        gambar: data.gambar,
        peran: data.peran,
        jurusan: data.jurusan,
        NIS: data.nis, // Tambahkan NIS ke data pengguna baru
      },
    });

    // Buat token JWT untuk pengguna baru
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Kirim token dan data user
    return { token, user: newUser };
  } catch (error) {
    // Tangani error dengan melempar error ke atas
    throw new Error(error.message);
  }
}

module.exports = {
  authenticateUser,
  registerUser,
};
