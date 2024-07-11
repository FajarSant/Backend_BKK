const express = require("express");
const upload = require("../middleware/upload.middleware");
const {
  GetAllUsers,
  GetUserById,
  CreateUsers,
  UpdateUserById,
  DeleteUserById,
} = require("./user.service");

const bcrypt = require("bcryptjs");

const router = express.Router();

// Route untuk mendapatkan semua pengguna
router.get("/", async (req, res) => {
  try {
    const users = await GetAllUsers();
    res.json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ message: "Error retrieving users", error: error.message });
  }
});

// Route untuk mendapatkan pengguna berdasarkan ID
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

// Route untuk membuat pengguna baru dengan upload gambar
// Route untuk membuat pengguna baru dengan upload gambar
router.post("/", upload.single("gambar"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send("Mohon unggah file");
    }

    const imageUrl = `http://localhost:${process.env.PORT || 2000}/uploads/${file.filename}`;

    const newUserData = {
      ...req.body,
      kataSandi: req.body.kataSandi, // Pastikan kata sandi disimpan dengan aman
      gambar: imageUrl,
    };

    const newUser = await CreateUsers(newUserData);

    res.json({
      data: newUser,
      message: "User berhasil ditambahkan",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ message: "Failed to create user", error: error.message });
  }
});

// Route untuk memperbarui pengguna berdasarkan ID
router.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updateUserData = req.body;

    // Hash password baru jika ada
    if (updateUserData.kataSandi) {
      updateUserData.kataSandi = await bcrypt.hash(updateUserData.kataSandi, 10);
    }

    const updatedUser = await UpdateUserById(userId, updateUserData);

    res.status(200).json({
      message: "User berhasil diperbarui",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});
// Route untuk menghapus pengguna berdasarkan ID
router.delete("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await DeleteUserById(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "User berhasil dihapus",
      data: deletedUser,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
});

module.exports = router;
