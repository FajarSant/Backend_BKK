const express = require("express");
const prisma = require("../db");

const {
  GetAllUsers,
  GetUserById,
  CreateUsers,
  UpdateUserById,
  DeleteUserById,
} = require("./user.service");

const router = express.Router();

router.get("/", async (req, res) => {
  const lamaran = await GetAllUsers();
  res.send(lamaran);
});

router.get("/:id", async (req, res) => {
  try {
    const usersid = req.params.id;
    const users = await GetUserById(usersid);

    if (!users) {
      throw new Error("User Not Found");
    }

    res.send(users);
  } catch (error) {
    console.error("Error getting post:", error);
    res.status(404).send("User not found");
  }
});

router.post("/", async (req, res) => {
  try {
    const NewUserData = req.body;
    const Users = await CreateUsers(NewUserData);

    res.send({
      data: Users,
      message: "users Berhasil Ditambahkan",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const Usersid = req.params.id;
    const UpdateUserData = req.body;
    const UpdateUser = await UpdateUserById(Usersid, UpdateUserData);

    res.send({
      message: "users berhasil diperbarui",
      UpdateUser: UpdateUser,
    });
  } catch (error) {
    console.error("Error updating Users:", error);
    res.status(404).send("users not found");
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const usersid = req.params.id;
    const patchData = req.body;
    const UpdateUser = await UpdateUserById(usersid, patchData);

    res.send({
      message: "users berhasil diperbarui dengan patch",
      UpdateUser: UpdateUser,
    });
  } catch (error) {
    console.error("Error patching Users:", error);
    res.status(404).send("users not found");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const usersid = req.params.id;
    const DeleteUser = await DeleteUserById(usersid);

    if (!DeleteUser) {
      throw new Error("users Not Found");
    }

    res.send({
      message: "users berhasil dihapus",
      DeleteUser: DeleteUser,
    });
  } catch (error) {
    console.error("Error deleting Users:", error);
    res.status(404).send("users not found");
  }
});

module.exports = router;
