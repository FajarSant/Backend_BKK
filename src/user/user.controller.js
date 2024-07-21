const express = require("express");
const upload = require("../middleware/uploaduser.middleware");
const {
  GetAllUsers,
  GetUserById,
  CreateUsers,
  UpdateUserById,
  DeleteUserById,
  importUsersFromExcel,
} = require("./user.service");

const bcrypt = require("bcryptjs");

const router = express.Router();

router.post('/import', upload.single('file'), importUsersFromExcel);


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

router.put("/:id", upload.single('gambar'), async (req, res) => {
  try {
    const userId = req.params.id;
    const updateUserData = req.body;

    // Jika ada file yang diunggah, gunakan file tersebut
    const file = req.file;

    // Panggil fungsi untuk memperbarui pengguna
    const updatedUser = await UpdateUserById(userId, updateUserData, file);

    res.status(200).json({
      message: "User berhasil diperbarui",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
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
      message: "User berhasil dihapus",
      data: deletedUser,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
});

module.exports = router;
