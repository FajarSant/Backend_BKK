const express = require("express");
const {
  GetAllPelatihan,
  GetPelatihanById,
  CreatePelatihan,
  UpdatePelatihan,
  DeletePelatihan,
} = require("./pelatihan.service");
const { uploadImage } = require("./pelatihan.middleware");

const router = express.Router();

// Get all pelatihan
router.get("/", async (req, res) => {
  try {
    const pelatihan = await GetAllPelatihan();
    res.send(pelatihan);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get pelatihan by ID
router.get("/:id", async (req, res) => {
  try {
    const pelatihanId = req.params.id;
    const pelatihan = await GetPelatihanById(pelatihanId);

    if (!pelatihan) {
      return res.status(404).send("Pelatihan not found");
    }

    res.send(pelatihan);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create new pelatihan
router.post("/", uploadImage.single("gambar"), async (req, res) => {
  try {
    const file = req.file;
    const imageUrl = file ? `http://localhost:${process.env.PORT || 2000}/uploads/pelatihan/${file.filename}` : null;

    const newPelatihanData = {
      ...req.body,
      gambar: imageUrl,
    };

    const newPelatihan = await CreatePelatihan(newPelatihanData);

    res.status(201).json({
      data: newPelatihan,
      message: "Pelatihan successfully created",
    });
  } catch (error) {
    res.status(400).json({ message: "Failed to create pelatihan", error: error.message });
  }
});

// Update pelatihan
router.put("/:id", uploadImage.single("gambar"), async (req, res) => {
  try {
    const pelatihanId = req.params.id;
    const file = req.file;
    const imageUrl = file ? `http://localhost:${process.env.PORT || 2000}/uploads/pelatihan/${file.filename}` : req.body.gambar;

    const updatedPelatihanData = {
      ...req.body,
      gambar: imageUrl,
    };

    const updatedPelatihan = await UpdatePelatihan(pelatihanId, updatedPelatihanData);

    res.json({
      data: updatedPelatihan,
      message: "Pelatihan successfully updated",
    });
  } catch (error) {
    res.status(400).json({ message: "Failed to update pelatihan", error: error.message });
  }
});

// Delete pelatihan
router.delete("/:id", async (req, res) => {
  try {
    const pelatihanId = req.params.id;
    await DeletePelatihan(pelatihanId);

    res.json({
      message: "Pelatihan successfully deleted",
    });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete pelatihan", error: error.message });
  }
});

module.exports = router;
