const express = require("express");
const prisma = require("../db");
const upload = require("../middleware/upload.middleware"); // Import middleware upload

const {
  GetAllJobs,
  GetJobsById,
  CreateJobs,
  UpdateJobsById,
  DeleteJobsById,
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

router.post("/", upload.single("gambar"), async (req, res) => {
  try {
    const NewJobsData = req.body;
    
    // Validasi input
    if (!NewJobsData.judul || !NewJobsData.namaPT || !NewJobsData.deskripsi || !NewJobsData.alamat || !NewJobsData.email || !NewJobsData.nomorTelepon) {
      throw new Error("Harap lengkapi semua bidang yang diperlukan: judul, nama PT, deskripsi, alamat, email, dan nomor telepon");
    }

    // Jika ada file gambar diunggah, simpan lokasi file atau data gambar di basis data
    if (req.file) {
      NewJobsData.gambar = req.file.path; // menyimpan path file gambar
    }

    const jobs = await CreateJobs(NewJobsData);

    res.send({
      data: jobs,
      message: "Jobs Berhasil Ditambahkan",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const jobsId = req.params.id;
    const updatedJobsData = req.body;
    const updatedJobs = await UpdateJobsById(jobsId, updatedJobsData);

    res.send({
      message: "Jobs berhasil diperbarui",
      updatedJobs: updatedJobs,
    });
  } catch (error) {
    console.error("Error updating jobs:", error);
    res.status(404).send("Jobs not found");
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const jobsId = req.params.id;
    const patchData = req.body;
    const updatedJobs = await UpdateJobsById(jobsId, patchData);

    res.send({
      message: "Jobs berhasil diperbarui dengan patch",
      updatedJobs: updatedJobs,
    });
  } catch (error) {
    console.error("Error patching jobs:", error);
    res.status(404).send("Jobs not found");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const jobsId = req.params.id;
    const deletedJobs = await DeleteJobsById(jobsId);

    if (!deletedJobs) {
      throw new Error("Jobs Not Found");
    }

    res.send({
      message: "Jobs berhasil dihapus",
      deletedJobs: deletedJobs,
    });
  } catch (error) {
    console.error("Error deleting jobs:", error);
    res.status(404).send("Jobs not found");
  }
});

module.exports = router;
