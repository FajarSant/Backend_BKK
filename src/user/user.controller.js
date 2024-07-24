const express = require("express");
const prisma = require("../db");
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { uploadExcel, uploadImage } = require("./user.middleware")
const {
  GetAllUsers,
  GetUserById,
  CreateUsers,
  UpdateUserById,
  DeleteUserById,
  importUsersFromExcel
} = require("./user.service");

const router = express.Router();

router.post('/import', uploadExcel.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("Please upload an Excel file.");
    }

    const filePath = path.join(__dirname, '../../uploads/excel', req.file.filename);
    const result = await importUsersFromExcel(filePath);

    // Delete file after import
    fs.unlinkSync(filePath);

    res.json(result);
  } catch (error) {
    console.error("Error importing users from Excel:", error);
    res.status(500).json({ message: "Failed to import data from Excel.", error: error.message });
  }
});

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

router.post("/", uploadImage.single("gambar"), async (req, res) => {
  try {
    const file = req.file;

    // Handle image upload
    const imageUrl = file ? `http://localhost:${process.env.PORT || 2000}/uploads/users/${file.filename}` : null;

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

router.put('/:id', uploadImage.single('gambar'), async (req, res) => {
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
      imageUrl = `http://localhost:${process.env.PORT || 2000}/uploads/users/${file.filename}`;
      
      
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
    const deletedUser = await DeleteUserById(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "User successfully deleted",
      data: deletedUser,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
});


module.exports = router;
