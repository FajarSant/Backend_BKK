const prisma = require("../db");
const bcrypt = require('bcryptjs');

// Fungsi untuk mendapatkan semua pengguna
const GetAllUsers = async () => {
  const users = await prisma.pengguna.findMany({
    select: {
      id: true,
      nama: true,
      email: true,
      alamat: true,
      peran: true,
      jurusan: true,
      nomortelepon: true,
      gambar: true,
    },
  });

  return users;
};

// Fungsi untuk mendapatkan pengguna berdasarkan ID
const GetUserById = async (id) => {
  try {
    const user = await prisma.pengguna.findUnique({
      where: {
        id: id,
      },
    });
    return user;
  } catch (error) {
    throw new Error(`Failed to get user: ${error.message}`);
  }
};

// Fungsi untuk membuat pengguna baru
const CreateUsers = async (userData) => {
  try {
    const hashedPassword = await bcrypt.hash(userData.kataSandi, 10); // Hashing password
    const newUser = await prisma.pengguna.create({
      data: {
        ...userData,
        kataSandi: hashedPassword,
      },
    });
    return newUser;
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

const UpdateUserById = async (id, userData) => {
  try {
    // Verifikasi kata sandi lama
    if (userData.oldPassword) {
      // Ambil data pengguna saat ini
      const currentUser = await prisma.pengguna.findUnique({
        where: { id },
      });

      if (!currentUser) {
        throw new Error('Pengguna tidak ditemukan');
      }

      // Bandingkan kata sandi lama dengan menggunakan bcrypt.compare
      const isPasswordValid = await bcrypt.compare(userData.oldPassword, currentUser.kataSandi);

      if (!isPasswordValid) {
        throw new Error('Kata sandi lama salah');
      }

      // Hash kata sandi baru
      userData.kataSandi = await bcrypt.hash(userData.newPassword, 10);
    }

    // Lakukan update data pengguna
    const updatedUser = await prisma.pengguna.update({
      where: { id },
      data: {
        nama: userData.nama,
        email: userData.email,
        peran: userData.peran,
        alamat: userData.alamat,
        jurusan: userData.jurusan,
        nomortelepon: userData.nomortelepon,
        kataSandi: userData.kataSandi, // hanya meng-update jika ada perubahan
        gambar: userData.gambar,
        // tambahkan field lain sesuai kebutuhan Anda
      },
    });

    return updatedUser;
  } catch (error) {
    throw new Error(`Gagal memperbarui pengguna: ${error.message}`);
  }
};

// Fungsi untuk menghapus pengguna berdasarkan ID
const DeleteUserById = async (id) => {
  try {
    const deletedUser = await prisma.pengguna.delete({
      where: { id },
    });
    return deletedUser;
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
};

module.exports = {
  GetAllUsers,
  GetUserById,
  CreateUsers,
  UpdateUserById,
  DeleteUserById,
};
