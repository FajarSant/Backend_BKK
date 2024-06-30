const prisma = require("../db");
const bcrypt = require('bcryptjs');

// Fungsi untuk mendapatkan semua pengguna
const GetAllUsers = async () => {
  const users = await prisma.pengguna.findMany({
    select: {
      id: true,
      nama: true,
      email: true,
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

// Fungsi untuk membuat pengguna baru
const CreateUsers = async (UserData) => {
  const hashedPassword = await bcrypt.hash(UserData.kataSandi, 10); // Hashing password
  const users = await prisma.pengguna.create({
    data: {
      ...UserData,
      kataSandi: hashedPassword,
    },
  });
  return users;
};

// Fungsi untuk memperbarui pengguna berdasarkan ID
const UpdateUserById = async (id, UserData) => {
  try {
    const UpdatedUser = await prisma.pengguna.update({
      where: {
        id: id,
      },
      data: UserData,
    });

    return UpdatedUser;
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
