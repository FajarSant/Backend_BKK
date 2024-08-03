const express = require("express");
const prisma = require("../db");
const { uploadImage, upload } = require("./user.middleware");
const {
  GetAllUsers,
  GetUserById,
  CreateUsers,
  UpdateUserById,
  DeleteUserById,
  importUsersFromExcel,
} = require("./user.service");

const XLSX = require("xlsx");
const cloudinary = require('../config/Cloudinary');

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await GetAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: "Error retrieving users", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await GetUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ message: "Error getting user", error: error.message });
  }
});

router.post("/", upload.single("gambar"), uploadImage, async (req, res) => {
  try {
    const file = req.file;

    // Handle image upload
    const imageUrl = file ? file.cloudinary.url : null;

    const newUserData = {
      ...req.body,
      katasandi: req.body.katasandi, // Ensure password is handled securely
      gambar: imageUrl,
    };

    const newUser = await CreateUsers(newUserData);

    res.status(201).json({
      data: newUser,
      message: "User successfully created",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ message: "Failed to create user", error: error.message });
  }
});

router.post("/excel", upload.single("file"), async (req, res) => {
  const fileBuffer = req.file.buffer;

  try {
    // Baca file Excel dari buffer
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    // Panggil fungsi untuk mengimpor pengguna
    const result = await importUsersFromExcel(data);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error importing users:", error);
    res.status(500).json({ message: "Failed to import users", error: error.message });
  }
});

router.put('/:id', upload.single('gambar'), uploadImage, async (req, res) => {
  const userId = req.params.id;

  try {
    const existingUser = await prisma.pengguna.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const file = req.file;
    let imageUrl;

    if (file) {
      imageUrl = file.cloudinary.url;
    }

    const updatedUserData = {
      ...req.body,
      gambar: imageUrl || existingUser.gambar, // Pertahankan gambar lama jika tidak ada gambar baru
    };

    const updatedUser = await UpdateUserById(userId, updatedUserData);

    res.json({
      data: updatedUser,
      message: 'User successfully updated',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json({ message: 'Failed to update user', error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    // Retrieve the user to get the image URL
    const user = await GetUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the publicId from the image URL
    const publicId = user.gambar ? `users/${decodeURIComponent(user.gambar.split('/').pop().split('.')[0])}` : null;

    // Delete the user record
    const deletedUser = await DeleteUserById(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the image from Cloudinary if it exists
    if (publicId) {
      const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
      console.log('Cloudinary delete result:', result);

      if (result.result !== 'ok' && result.result !== 'not found') {
        throw new Error(`Failed to delete image from Cloudinary: ${result.error?.message || 'Unknown error'}`);
      }
    }

    res.json({
      message: "User and image successfully deleted",
      data: deletedUser,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
});

module.exports = router;
