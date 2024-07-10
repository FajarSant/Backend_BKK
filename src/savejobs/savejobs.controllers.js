const express = require('express');
const router = express.Router();
const lowonganTersimpanService = require('./savejobs.service');

// Get all LowonganTersimpan records with related Pekerjaan and Pengguna
router.get('/', async (req, res) => {
  try {
    const lowonganTersimpan = await lowonganTersimpanService.getAllLowonganTersimpan();
    res.json(lowonganTersimpan);
  } catch (error) {
    console.error("Error retrieving lowongan tersimpan:", error);
    res.status(500).json({ message: 'Error retrieving lowongan tersimpan' });
  }
});

// Get LowonganTersimpan by ID with related Pekerjaan and Pengguna
router.get('/:id', async (req, res) => {
  try {
    const lowonganTersimpan = await lowonganTersimpanService.getLowonganTersimpanById(req.params.id);
    if (!lowonganTersimpan) {
      return res.status(404).json({ message: 'Lowongan tersimpan not found' });
    }
    res.json(lowonganTersimpan);
  } catch (error) {
    console.error("Error retrieving lowongan tersimpan:", error);
    res.status(500).json({ message: 'Error retrieving lowongan tersimpan' });
  }
});

// Create a new LowonganTersimpan
router.post('/', async (req, res) => {
  const { pekerjaanId, penggunaId } = req.body;
  if (!pekerjaanId || !penggunaId) {
    return res.status(400).json({ message: 'Pekerjaan ID and Pengguna ID are required' });
  }

  try {
    const newLowonganTersimpan = await lowonganTersimpanService.createLowonganTersimpan({
      pekerjaanId,
      penggunaId,
    });
    res.json(newLowonganTersimpan);
  } catch (error) {
    console.error("Error creating lowongan tersimpan:", error);
    res.status(500).json({ message: 'Error creating lowongan tersimpan' });
  }
});

// Update LowonganTersimpan by ID
router.put('/:id', async (req, res) => {
  const { pekerjaanId, penggunaId } = req.body;
  if (!pekerjaanId || !penggunaId) {
    return res.status(400).json({ message: 'Pekerjaan ID and Pengguna ID are required' });
  }

  try {
    const updatedLowonganTersimpan = await lowonganTersimpanService.updateLowonganTersimpan(req.params.id, {
      pekerjaanId,
      penggunaId,
    });
    res.json(updatedLowonganTersimpan);
  } catch (error) {
    console.error("Error updating lowongan tersimpan:", error);
    res.status(500).json({ message: 'Error updating lowongan tersimpan' });
  }
});

// Delete LowonganTersimpan by ID
router.delete('/:id', async (req, res) => {
  try {
    await lowonganTersimpanService.deleteLowonganTersimpan(req.params.id);
    res.json({ message: 'Lowongan tersimpan deleted successfully' });
  } catch (error) {
    console.error("Error deleting lowongan tersimpan:", error);
    res.status(500).json({ message: 'Error deleting lowongan tersimpan' });
  }
});

module.exports = router;
