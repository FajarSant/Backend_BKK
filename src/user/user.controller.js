const express = require('express');
const upload = require('../middleware/upload.middleware');
const {
  GetAllUsers,
  GetUserById,
  CreateUsers,
  UpdateUserById,
  DeleteUserById,
} = require('./user.service');

const router = express.Router();

// Route untuk mendapatkan semua pengguna
router.get("/", async (req, res) => {
  const users = await GetAllUsers();
  res.send(users);
});

// Route untuk mendapatkan pengguna berdasarkan ID
router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await GetUserById(userId);

    if (!user) {
      throw new Error("User Not Found");
    }

    res.send(user);
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(404).send("User not found");
  }
});

// Route untuk membuat pengguna baru dengan upload gambar
router.post("/", upload.single('gambar'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send('Mohon unggah file');
    }

    const imageUrl = `http://localhost:${process.env.PORT || 3000}/uploads/${file.filename}`;
    
    const newUserData = {
      ...req.body,
      gambar: imageUrl,
    };

    const newUser = await CreateUsers(newUserData);

    res.send({
      data: newUser,
      message: "User Berhasil Ditambahkan",
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).send(error.message);
  }
});

// Route untuk memperbarui pengguna berdasarkan ID
router.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updateUserData = req.body;
    const updatedUser = await UpdateUserById(userId, updateUserData);

    res.send({
      message: "User berhasil diperbarui",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(404).send("User not found");
  }
});

// Route untuk menghapus pengguna berdasarkan ID
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await DeleteUserById(userId);

    if (!deletedUser) {
      throw new Error("User Not Found");
    }

    res.send({
      message: "User berhasil dihapus",
      data: deletedUser,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(404).send("User not found");
  }
});

module.exports = router;
