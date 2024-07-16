const express = require('express');
const router = express.Router();
const lamaranService = require('./application.service');
// Get all Lamaran records with related Pengguna and Pekerjaan details
router.get('/', async (req, res) => {
  try {
    const lamaran = await lamaranService.getAllLamaran();
    res.json(lamaran);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving lamaran', error });
  }
});

// Get Lamaran by ID
router.get('/:id', async (req, res) => {
  try {
    const lamaran = await lamaranService.getLamaranById(req.params.id);
    if (!lamaran) {
      return res.status(404).json({ message: 'Lamaran not found' });
    }
    res.json(lamaran);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving lamaran', error });
  }
});
router.post('/', async (req, res) => {
  const { pekerjaanId, penggunaId } = req.body;
  if (!pekerjaanId || !penggunaId) {
    return res.status(400).json({ message: 'Pekerjaan ID and Pengguna ID are required' });
  }

  try {
    const newLamaran = await lamaranService.createLamaran({
      pekerjaanId,
      penggunaId,
    });
    res.json(newLamaran);
  } catch (error) {
    console.error("Error creating lowongan tersimpan:", error);
    res.status(500).json({ message: 'Error creating lowongan tersimpan' });
  }
});

// Update Lamaran status
router.put('/:id', async (req, res) => {
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  try {
    const updatedLamaran = await lamaranService.updateLamaran(req.params.id, { status });
    res.json(updatedLamaran);
  } catch (error) {
    res.status(500).json({ message: 'Error updating lamaran', error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await lamaranService.deleteLamaran (req.params.id);
    res.json({ message: 'Lowongan tersimpan deleted successfully' });
  } catch (error) {
    console.error("Error deleting lowongan tersimpan:", error);
    res.status(500).json({ message: 'Error deleting lowongan tersimpan' });
  }
});

module.exports = router;