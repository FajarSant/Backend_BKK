const prisma = require("../db");

const GetALLUsers = async () => {
  const users = await prisma.users.findMany();

  return users;
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

const CreateUser = async (newUserData) => {
  const user = await prisma.users.create({
    data: {
      image: newUserData.image,
      nama: newUserData.nama,
      jeniskelamin: newUserData.jeniskelamin,
      user: newUserData.user,
      email: newUserData.email,
      password: newUserData.password,
      alamat: newUserData.alamat,
      tempat: newUserData.tempat,
      tanggalLahir: newUserData.tanggalLahir,
    },
  });
  return user;
};

const DeleteUserById = async (id) => {
    try {
      const user = await prisma.users.findUnique({
        where: {
          id,
        },
      });
  
      if (!user) {
        throw new Error("User not found");
      }
      const deletedUser = await prisma.users.delete({
        where: {
          id,  
        },
      });
  
      return deletedUser; // Kembalikan pengguna yang dihapus
    } catch (error) {
      throw error;
    }
  };

const EditUserById = async (id, userData) => {
    const user = await prisma.users.update({
      where: {
        id: Number(id), // Menggunakan parameter 'id' yang diterima dari fungsi
      },
      data: {
        image: userData.image,
        nama: userData.nama,
        jeniskelamin: userData.jeniskelamin,
        user: userData.user,
        email: userData.email,
        password: userData.password,
        alamat: userData.alamat,
        tempat: userData.tempat,
        tanggalLahir: userData.tanggalLahir,
      },
    });
    return user;
  };


module.exports = {
  GetALLUsers,
  GetUserById,
  CreateUser,
  DeleteUserById,
  EditUserById,
};
