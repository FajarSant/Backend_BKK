const express = require("express");
const {
  GetAllLamaran,
  GetLamaranById,
  CreateLamaran,
  UpdateLamaranById,
  DeleteLamaranById,
} = require("./application.service");

const router = express.Router();

router.get("/", async (req, res) => {
  const lamaran = await GetAllLamaran();
  res.send(lamaran);
});

router.get("/:id", async (req, res) => {
  try {
    const lamaranId = req.params.id;
    const lamaran = await GetLamaranById(lamaranId);

    if (!lamaran) {
      throw new Error("Lamaran Not Found");
    }

    res.send(lamaran);
  } catch (error) {
    console.error("Error getting lamaran:", error);
    res.status(404).send("Lamaran not found");
  }
});

router.post("/", async (req, res) => {
  try {
    const newLamaranData = req.body;
    const lamaran = await CreateLamaran(newLamaranData);

    res.send({
      data: lamaran,
      message: "Lamaran Berhasil Ditambahkan",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const lamaranId = req.params.id;
    const updatedLamaranData = req.body;
    const updatedLamaran = await UpdateLamaranById(lamaranId, updatedLamaranData);

    res.send({
      message: "Lamaran berhasil diperbarui",
      updatedLamaran: updatedLamaran,
    });
  } catch (error) {
    console.error("Error updating lamaran:", error);
    res.status(404).send("Lamaran not found");
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const lamaranId = req.params.id;
    const patchData = req.body;
    const updatedLamaran = await UpdateLamaranById(lamaranId, patchData);

    res.send({
      message: "Lamaran berhasil diperbarui dengan patch",
      updatedLamaran: updatedLamaran,
    });
  } catch (error) {
    console.error("Error patching lamaran:", error);
    res.status(404).send("Lamaran not found");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const lamaranId = req.params.id;
    const deletedLamaran = await DeleteLamaranById(lamaranId);

    if (!deletedLamaran) {
      throw new Error("Lamaran Not Found");
    }

    res.send({
      message: "Lamaran berhasil dihapus",
      deletedLamaran: deletedLamaran,
    });
  } catch (error) {
    console.error("Error deleting lamaran:", error);
    res.status(404).send("Lamaran not found");
  }
});

module.exports = router;
