const express = require("express");
const prisma = require("../db");
const {
  GetALLUsers,
  GetUserById,
  CreateUser,
  DeleteUserById,
  EditUserById,
} = require("./user.service");

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await GetALLUsers();

  res.send(users);
});

router.get("/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Panggil fungsi GetUserById dengan ID yang diberikan
      const user = await GetUserById(userId);
      
      // Jika pengguna tidak ditemukan, lempar kesalahan
      if (!user) {
        throw new Error("User Not Found");
      }
      
      // Kirim pengguna sebagai respons
      res.send(user);
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(404).send("User not found");
    }
  });

router.post("/", async (req, res) => {
  try {
    const newUserData = req.body;
    const user = await CreateUser(newUserData);

    res.send({
      data: user,
      message: "User Berhasil Dibuat",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete("/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      await DeleteUserById(userId);
  
      res.send("User Telah Dihapus");
    } catch (error) {
     res.status(400).send(error.message)
    }
  });

router.put("/:id", async (req, res) => {
  const Usersid = req.params.id;
  const UsersData = req.body;

  if (
    !(
      UsersData.image &
      UsersData.nama &
      UsersData.jeniskelamin &
      UsersData.user &
      UsersData.email &
      UsersData.password &
      UsersData.alamat &
      UsersData.tempat &
      UsersData.tanggalLahir 
    )
  ) {
    return res.status(401).send("some fields are missing");
  }

  const user = await EditUserById(parseInt (Usersid), UsersData);
  res.send({
    data: user,
    message: "Users Berhasil Diedit",
  });
});

router.patch("/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const userData = req.body;
  
      // Panggil fungsi EditUserById untuk mengedit pengguna berdasarkan ID dan data yang diberikan
      const user = await EditUserById(userId, userData);
  
      // Kirim respons dengan data pengguna yang telah diperbarui
      res.send({
        data: user,
        message: "User Berhasil Diedit",
      });
    } catch (error) {
      // Tangani kesalahan dan kirim pesan kesalahan yang sesuai
      console.error("Error editing user:", error);
      res.status(400).send(error.message);
    }
  });

module.exports = router;
