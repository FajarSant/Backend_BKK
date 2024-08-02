const prisma = require("../db");
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

// Retrieve all users
const GetAllUsers = async () => {
  try {
    const users = await prisma.pengguna.findMany({
      select: {
        id: true,
        nama: true,
        email: true,
        NIS: true,
        alamat: true,
        peran: true,
        tanggallahir: true,
        jurusan: true,
        nomortelepon: true,
        gambar: true,
        lamaran: {
          select: {
            pekerjaan: {
              select: {
                namaPT: true,
              },
            },
          },
        },
        lowonganTersimpan: {
          select: {
            pekerjaan: {
              select: {
                namaPT: true,
              },
            },
          },
        },
      },
    });
    return users;
  } catch (error) {
    throw new Error(`Failed to get users: ${error.message}`);
  }
};

// Retrieve user by ID
const GetUserById = async (id) => {
  try {
    const user = await prisma.pengguna.findUnique({
      where: { id },
      select: {
        id: true,
        nama: true,
        email: true,
        NIS: true,
        alamat: true,
        peran: true,
        tanggallahir: true,
        jurusan: true,
        nomortelepon: true,
        gambar: true,
        lamaran: {
          select: {
            pekerjaan: {
              select: {
                namaPT: true
              },
            },
          },
        },
        lowonganTersimpan: {
          select: {
            pekerjaan: {
              select: {
                namaPT:true
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

// Create new user
const CreateUsers = async (userData) => {
  try {
    const hashedPassword = await bcrypt.hash(userData.katasandi, 10);

    const newUser = await prisma.pengguna.create({
      data: {
        nama: userData.nama,
        email: userData.email,
        NIS: userData.NIS,
        katasandi: hashedPassword,
        tanggallahir: userData.tanggallahir ? new Date(userData.tanggallahir) : null,
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

// Update user by ID
const UpdateUserById = async (id, userData) => {
  try {
    const updates = { ...userData };

    if (userData.katasandi) {
      updates.katasandi = await bcrypt.hash(userData.katasandi, 10);
    }

    if (userData.tanggallahir) {
      updates.tanggallahir = new Date(userData.tanggallahir);
    }

    const updatedUser = await prisma.pengguna.update({
      where: { id },
      data: updates,
    });

    return updatedUser;
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

const DeleteUserById = async (id) => {
  try {
    // Check if the user exists
    const user = await prisma.pengguna.findUnique({ where: { id } });

    if (!user) {
      throw new Error('User not found');
    }

    // Delete associated lamaran (applications)
    await prisma.lamaran.deleteMany({
      where: { penggunaId: id },
    });

    // Delete associated lowonganTersimpan (saved job listings)
    await prisma.lowonganTersimpan.deleteMany({
      where: { penggunaId: id },
    });

    // Delete user's image if it exists
    if (user.gambar) {
      const imagePath = path.resolve(__dirname, '../../uploads/users', path.basename(user.gambar));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      } else {
        console.warn('Image not found, skipping deletion:', imagePath);
      }
    }

    // Delete user from the database
    const deletedUser = await prisma.pengguna.delete({
      where: { id },
    });

    return deletedUser;
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
};


// Import users from Excel
const importUsersFromExcel = async (filePath) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    for (const row of data) {
      // Ensure all fields are present
      const {
        NIS,
        email,
        nama,
        kataSandi,
        tanggallahir,
        alamat,
        nomorTelepon,
        peran,
        jurusan,
        gambar = null // Set default value if not present
      } = row;

      if (
        NIS === undefined || email === undefined || nama === undefined ||
        kataSandi === undefined || tanggallahir === undefined || alamat === undefined ||
        nomorTelepon === undefined || peran === undefined || jurusan === undefined
      ) {
        console.error("Missing required user fields", row);
        continue; // Skip this user if any required field is missing
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(kataSandi.toString(), 10);

      await prisma.pengguna.create({
        data: {
          nama: nama.toString(),
          email: email.toString(),
          NIS: NIS.toString(),
          katasandi: hashedPassword,
          alamat: alamat.toString(),
          nomortelepon: nomorTelepon.toString(),
          peran: peran.toString(),
          jurusan: jurusan.toString(),
          gambar: gambar ? gambar.toString() : null,
        },
      });
    }

    return { message: "Data berhasil diimpor." };
  } catch (error) {
    console.error("Error importing users from Excel:", error);
    throw new Error(`Error importing users from Excel: ${error.message}`);
  }
};

module.exports = {
  GetAllUsers,
  GetUserById,
  CreateUsers,
  UpdateUserById,
  DeleteUserById,
  importUsersFromExcel,
};
