const prisma = require("../db");
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

// Set up storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/users'));
  },
  filename: (req, file, cb) => {
    // Gunakan nama NIS sebagai nama file atau fallback ke timestamp
    const nis = req.body.NIS ? req.body.NIS : Date.now();
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${nis}${extension}`);
  }
});

// File filter to accept only specific file types (optional, for example, Excel files)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.xlsx', '.xls'];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Only Excel files are allowed!'), false);
  }
};

// Create multer instance with storage and fileFilter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter, // Optional: Use fileFilter if you need to restrict file types
  limits: {
    fileSize: 5 * 1024 * 1024 // Limit file size to 5MB (optional)
  }
});
const GetAllUsers = async () => {
  const users = await prisma.pengguna.findMany({
    select: {
      id: true,
      nama: true,
      email: true,
      NIS: true,
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
        NIS: true,
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

const UpdateUserById = async (id, userData, file) => {
  try {
    let gambar = userData.gambar;

    if (file) {
      gambar = `uploads/users/${file.filename}`;

      // Hapus gambar lama jika ada
      const existingUser = await prisma.pengguna.findUnique({ where: { id } });
      if (existingUser && existingUser.gambar) {
        const oldImagePath = path.resolve(__dirname, '../uploads/users', path.basename(existingUser.gambar));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log('Old image successfully deleted.');
        } else {
          console.log('Old image file not found at:', oldImagePath);
        }
      }
    }

    if (userData.kataSandi) {
      userData.kataSandi = await bcrypt.hash(userData.kataSandi, 10);
    }

    const updatedUser = await prisma.pengguna.update({
      where: { id },
      data: {
        nama: userData.nama,
        email: userData.email,
        peran: userData.peran,
        NIS: userData.NIS,
        alamat: userData.alamat,
        jurusan: userData.jurusan,
        tanggallahir: userData.tanggallahir ? new Date(userData.tanggallahir) : null,
        nomortelepon: userData.nomortelepon,
        kataSandi: userData.kataSandi,
        gambar: gambar || undefined,
      },
    });

    return updatedUser;
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

const DeleteUserById = async (id) => {
  try {
    const user = await prisma.pengguna.findUnique({ where: { id } });

    if (!user) {
      throw new Error('User not found');
    }

    // Hapus gambar pengguna jika ada
    if (user.gambar) {
      const imagePath = path.resolve(__dirname, '../uploads/users', path.basename(user.gambar));

      console.log('Attempting to delete image at path:', imagePath);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log('Image successfully deleted.');
      } else {
        console.log('Image file not found at:', imagePath);
      }
    }

    // Hapus pengguna dari database
    const deletedUser = await prisma.pengguna.delete({
      where: { id },
    });

    return deletedUser;
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
};

const importUsersFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const filePath = path.join(__dirname, '../uploads/users', req.file.filename);

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; 
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    for (const row of data) {
      const {
        nama,
        email,
        NIS,
        alamat,
        peran,
        jurusan,
        nomortelepon,
        gambar,
        kataSandi,
        tanggallahir
      } = row;
      const hashedPassword = kataSandi ? await bcrypt.hash(kataSandi, 10) : null;

      await prisma.pengguna.create({
        data: {
          nama,
          email,
          NIS,
          alamat,
          peran,
          jurusan,
          nomortelepon,
          gambar,
          kataSandi: hashedPassword,
          tanggallahir: tanggallahir ? new Date(tanggallahir) : null,
        },
      });
    }

    // Delete the uploaded file
    fs.unlinkSync(filePath);

    res.status(200).send('Users imported successfully.');
  } catch (error) {
    res.status(500).send(`Failed to import users: ${error.message}`);
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
