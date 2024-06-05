const prisma = require("../db");

const GetAllUsers = async () => {
  const users = await prisma.pengguna.findMany({
    select: {
      id: true,
      nama: true,
      peran: true,
      jurusan: true,
    },
  });

  return users;
};

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
  const users = await prisma.pengguna.create({
    data:UserData,
  });
  return users;
};

const UpdateUserById = async (id, UserData) => {
  try {
    const UpdatedUser = await prisma.pengguna.update({
      where: {
        id: id, // Gunakan id dari argumen fungsi
      },
      data: UserData, // Gunakan data yang diterima dari argumen fungsi
    });

    return UpdatedUser;
  } catch (error) {
    throw new Error(`Failed to update users: ${error.message}`);
  }
};

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
