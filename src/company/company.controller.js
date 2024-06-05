const express = require("express");
const {
  GetAllPerusahaan,
  GetPerusahaanById,
  CreatePerusahaan,
  UpdatePerusahaanById,
  DeletePerusahaanById,
} = require("./company.service");

const router = express.Router();

router.get("/", async (req, res) => {
  const perusahaan = await GetAllPerusahaan();
  res.send(perusahaan);
});

router.get("/:id", async (req, res) => {
  try {
    const perusahaanId = req.params.id;
    const perusahaan = await GetPerusahaanById(perusahaanId);

    if (!perusahaan) {
      throw new Error("Perusahaan Not Found");
    }

    res.send(perusahaan);
  } catch (error) {
    console.error("Error getting perusahaan:", error);
    res.status(404).send("Perusahaan not found");
  }
});

router.post("/", async (req, res) => {
  try {
    const newPerusahaanData = req.body;
    const perusahaan = await CreatePerusahaan(newPerusahaanData);

    res.send({
      data: perusahaan,
      message: "Perusahaan Berhasil Ditambahkan",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const perusahaanId = req.params.id;
    const updatedPerusahaanData = req.body;
    const updatedPerusahaan = await UpdatePerusahaanById(perusahaanId, updatedPerusahaanData);

    res.send({
      message: "Perusahaan berhasil diperbarui",
      updatedPerusahaan: updatedPerusahaan,
    });
  } catch (error) {
    console.error("Error updating perusahaan:", error);
    res.status(404).send("Perusahaan not found");
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const perusahaanId = req.params.id;
    const patchData = req.body;
    const updatedPerusahaan = await UpdatePerusahaanById(perusahaanId, patchData);

    res.send({
      message: "Perusahaan berhasil diperbarui dengan patch",
      updatedPerusahaan: updatedPerusahaan,
    });
  } catch (error) {
    console.error("Error patching perusahaan:", error);
    res.status(404).send("Perusahaan not found");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const perusahaanId = req.params.id;
    const deletedPerusahaan = await DeletePerusahaanById(perusahaanId);

    if (!deletedPerusahaan) {
      throw new Error("Perusahaan Not Found");
    }

    res.send({
      message: "Perusahaan berhasil dihapus",
      deletedPerusahaan: deletedPerusahaan,
    });
  } catch (error) {
    console.error("Error deleting perusahaan:", error);
    res.status(404).send("Perusahaan not found");
  }
});

module.exports = router;
