const prisma = require("../db");
const bcrypt = require('bcryptjs');

// Fungsi untuk mendapatkan semua pengguna
const GetAllUsers = async () => {
  const users = await prisma.pengguna.findMany({
    select: {
      id: true,
      nama: true,
      email: true,
      alamat:true,
      peran: true,
      jurusan: true,
    },
  });

  return users;
};

// Fungsi untuk mendapatkan pengguna berdasarkan ID
const GetUserById = async (id) => {
  try {
    const users = await prisma.pengguna.findUnique({
      where: {
        id: id,
      },
    });
    if (!users) {
      return null;
    }

    return users;
  } catch (error) {
    throw new Error(`Failed to get users: ${error.message}`);
  }
};

const CreateUsers = async (UserData) => {
  try {
    const hashedPassword = await bcrypt.hash(UserData.kataSandi, 10); // Hashing password
    const newUser = await prisma.pengguna.create({
      data: {
        ...UserData,
        kataSandi: hashedPassword,
      },
    });
    return newUser;
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
};
// Fungsi untuk memperbarui pengguna berdasarkan ID
const UpdateUserById = async (id, userData) => {
  try {
    const updatedUser = await prisma.pengguna.update({
      where: { id },
      data: {
        nama: userData.nama,
        email: userData.email,
        peran: userData.peran,
        alamat: userData.alamat,
        jurusan: userData.jurusan, // Adjust based on your schema
        nomortelepon: userData.nomorTelepon, // Corrected field name
        kataSandi: userData.password,
        gambar: userData.gambar,
        // Add other fields as per your schema
      },
    });

    return updatedUser;
  } catch (error) {
    throw new Error(`Failed to update users: ${error.message}`);
  }
};

// Fungsi untuk menghapus pengguna berdasarkan ID
const DeleteUserById = async (id) => {
  try {
    const DeleteUser = await prisma.pengguna.delete({
      where: {
        id: id,
      },
    });
    return DeleteUser;
  } catch (error) {
    throw new Error(`Failed to delete users: ${error.message}`);
  }
};

module.exports = {
  GetAllUsers,
  GetUserById,
  CreateUsers,
  UpdateUserById,
  DeleteUserById,
};
