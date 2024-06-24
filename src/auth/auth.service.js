const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../db");

require("dotenv").config();

async function authenticateUser(email, password) {
  try {
    const user = await prisma.pengguna.findUnique({ where: { email } });

    if (!user) {
      throw new Error("Email tidak ditemukan");
    }

    const passwordMatch = await bcrypt.compare(password, user.kataSandi);

    if (!passwordMatch) {
      throw new Error("Password salah");
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return { token, user };
  } catch (error) {
    throw new Error(error.message);
  }
}

async function registerUser(data) {
  try {
    const hashedPassword = await bcrypt.hash(data.kataSandi, 10);

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

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return { token, user: newUser };
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  authenticateUser,
  registerUser,
};
