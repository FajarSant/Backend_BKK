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
      lamaran: {
        select: {
          pekerjaan: {
            select: {
              judul: true,
            },
          },
        },
      },
      lowonganTersimpan: {
        select: {
          pekerjaan: {
            select: {
              judul: true,
            },
          },
        },
      },
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
      select: {
        id: true,
        nama: true,
        email: true,
        alamat: true,
        peran: true,
        jurusan: true,
        nomortelepon: true,
        gambar: true,
        lamaran: {
          select: {
            pekerjaan: {
              select: {
                judul: true,
              },
            },
          },
        },
        lowonganTersimpan: {
          select: {
            pekerjaan: {
              select: {
                judul: true,
              },
            },
          },
        },
      },
    });
    return user;
  } catch (error) {
    throw new Error(`Failed to get user: ${error.message}`);
  }
};
const CreateUsers = async (userData) => {
  try {
    const hashedPassword = await bcrypt.hash(userData.kataSandi, 10);
    const newUser = await prisma.pengguna.create({
      data: {
        nama: userData.nama,
        email: userData.email,
        NIS: userData.NIS,
        kataSandi: hashedPassword,
        tanggallahir: new Date(userData.tanggallahir), // Sesuaikan dengan format yang benar
        alamat: userData.alamat,
        nomortelepon: userData.nomortelepon,
        peran: userData.peran,
        jurusan: userData.jurusan,
        gambar: userData.gambar,
      },
    });
    return newUser;
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

const UpdateUserById = async (id, userData) => {
  try {
    if (userData.kataSandi) {
      userData.kataSandi = await bcrypt.hash(userData.kataSandi, 10);
    }
    const updatedUser = await prisma.pengguna.update({
      where: { id },
      data: {
        nama: userData.nama,
        email: userData.email,
        peran: userData.peran,
        alamat: userData.alamat,
        jurusan: userData.jurusan,
        nomortelepon: userData.nomortelepon,
        kataSandi: userData.kataSandi,
        gambar: userData.gambar,
      },
    });
    return updatedUser;
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`);
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
