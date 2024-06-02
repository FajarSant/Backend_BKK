// auth.service.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;

const authUser = async (email, password) => {
  try {
    // Cari pengguna berdasarkan email
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    // Jika pengguna tidak ditemukan
    if (!user) {
      console.log("User not found with email:", email);
      return null;
    }

    // Jika pengguna ditemukan, periksa apakah password cocok
    if (user.password === password) {
      console.log("User found and password matched:", user);

      // Buat token JWT
      const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });

      return { user, token }; // Kembalikan pengguna dan token JWT
    } else {
      console.log("Password incorrect for user:", user);
      return null; // Kembalikan null jika kredensial tidak valid
    }
  } catch (error) {
    console.error("Error validating user credentials:", error.message);
    throw new Error("Error validating user credentials");
  }
};
const GetUserById = async (id) => {
    if (typeof id !== "number") {
      throw new Error("ID Not a Number");
    }
  
    const user = await prisma.users.findUnique({
      where: {
        id,
      },
    });
  
    return user;
  };

module.exports = {
  authUser,
  GetUserById,
};