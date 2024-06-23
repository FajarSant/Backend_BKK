const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function authenticateUser(email, password) {
  try {
    // Cari pengguna berdasarkan email
    const user = await prisma.pengguna.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error('Email tidak ditemukan');
    }

    // Periksa kecocokan password
    const passwordMatch = await bcrypt.compare(password, user.kataSandi);

    if (!passwordMatch) {
      throw new Error('Password salah');
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Sesuaikan dengan kebutuhan Anda
    });

    return { token };
  } catch (error) {
    throw new Error(error.message);
  }
}

async function registerUser(data) {
  try {
    // Hash kata sandi sebelum disimpan ke basis data
    const hashedPassword = await bcrypt.hash(data.kataSandi, 10); // salt rounds = 10

    // Simpan pengguna baru ke basis data
    const newUser = await prisma.pengguna.create({
      data: {
        email: data.email,
        kataSandi: hashedPassword,
        nama: data.nama,
        alamat: data.alamat,
        nomortelepon: data.nomortelepon,
        gambar: data.gambar,
        peran: data.peran,
        jurusan: data.jurusan,
      },
    });

    // Generate JWT token untuk pengguna yang baru terdaftar
    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Sesuaikan dengan kebutuhan Anda
    });

    return { token };
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  authenticateUser,
  registerUser,
};
