const express = require("express");
const prisma = require("../db");
const path = require('path');
const fs = require('fs');
const { uploadImage, cleanAndParseArrayString} = require ('./jobs.middleware')
const {
  GetAllJobs,
  GetJobsById,
  CreateJobs,
  UpdateJobsById,
  DeleteJobsById,
  DeleteApplicationsByJobId,
  DeleteSavedApplicationsByJobId,
} = require("./Jobs.service");

const router = express.Router();

router.get("/", async (req, res) => {
  const lamaran = await GetAllJobs();
  res.send(lamaran);
});

router.get("/:id", async (req, res) => {
  try {
    const jobsId = req.params.id;
    const Jobs = await GetJobsById(jobsId);

    if (!Jobs) {
      throw new Error("Post Not Found");
    }

    res.send(Jobs);
  } catch (error) {
    console.error("Error getting post:", error);
    res.status(404).send("Post not found");
  }
});

router.post("/", uploadImage.single("gambar"), async (req, res) => {
  try {
    const file = req.file;
    const imageUrl = file ? `https://backend-bkk.vercel.app/uploads/lamaran/${file.filename}` : null;

    // Memproses data baru dengan membersihkan dan memparsing persyaratan dan openrekrutmen
    const newJobData = {
      ...req.body,
      gambar: imageUrl,
      persyaratan: cleanAndParseArrayString(req.body.persyaratan),
      openrekrutmen: cleanAndParseArrayString(req.body.openrekrutmen)
    };

    if (!newJobData.namaPT || !newJobData.deskripsi || !newJobData.alamat || !newJobData.email || !newJobData.nomorTelepon) {
      throw new Error("Harap lengkapi semua bidang yang diperlukan: nama PT, deskripsi, alamat, email, dan nomor telepon");
    }

    const job = await CreateJobs(newJobData);

    res.status(201).json({
      data: job,
      message: "Job successfully created",
    });
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(400).json({ message: "Failed to create job", error: error.message });
  }
});

router.put("/:id", uploadImage.single("gambar"), async (req, res) => {
  try {
    const jobId = req.params.id;
    const file = req.file;

    // Ambil pekerjaan yang ada
    const oldJob = await GetJobsById(jobId);
    if (!oldJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Tentukan URL gambar baru
    const imageUrl = file ? `https://backend-bkk.vercel.app/uploads/lamaran/${file.filename}` : null;
    // Jika ada gambar lama, hapus gambar tersebut
    if (oldJob.gambar && imageUrl) {
      const oldImagePath = path.join(__dirname, '../uploads/lamaran', path.basename(oldJob.gambar));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Convert persyaratan and openrekrutmen to arrays if they are strings
    const persyaratan = typeof req.body.persyaratan === 'string' ? req.body.persyaratan.split(',') : req.body.persyaratan;
    const openrekrutmen = typeof req.body.openrekrutmen === 'string' ? req.body.openrekrutmen.split(',') : req.body.openrekrutmen;

    // Update data pekerjaan
    const updatedJobData = {
      ...req.body,
      gambar: imageUrl || oldJob.gambar, // Gunakan gambar baru jika ada, jika tidak, gunakan gambar lama
      persyaratan: persyaratan || oldJob.persyaratan,
      openrekrutmen: openrekrutmen || oldJob.openrekrutmen
    };

    const updatedJob = await UpdateJobsById(jobId, updatedJobData);

    res.status(200).json({
      data: updatedJob,
      message: "Job successfully updated",
    });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(400).json({ message: "Failed to update job", error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await GetJobsById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Hapus gambar yang terkait dengan pekerjaan jika ada
    if (job.gambar) {
      const imagePath = path.join(__dirname, '../../uploads/lamaran', path.basename(job.gambar));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Hapus lamaran dan lamaran tersimpan yang terkait dengan pekerjaan
    await DeleteApplicationsByJobId(jobId);
    await DeleteSavedApplicationsByJobId(jobId);

    // Hapus pekerjaan dari database
    await DeleteJobsById(jobId);

    res.status(200).json({ message: "Job successfully deleted" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(400).json({ message: "Failed to delete job", error: error.message });
  }
});


module.exports = router;
