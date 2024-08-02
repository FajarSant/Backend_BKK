// Jobs.controller.js
const express = require("express");
const { upload, uploadImage, cleanAndParseArrayString } = require('./jobs.middleware');
const {
  GetAllJobs,
  GetJobsById,
  CreateJobs,
  UpdateJobsById,
  DeleteJobsById,
  DeleteApplicationsByJobId,
  DeleteSavedApplicationsByJobId,
} = require("./Jobs.service");
const cloudinary = require('../config/Cloudinary');

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const jobs = await GetAllJobs();
    res.send(jobs);
  } catch (error) {
    console.error("Error getting jobs:", error);
    res.status(500).send("Failed to get jobs");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await GetJobsById(jobId);

    if (!job) {
      throw new Error("Job not found");
    }

    res.send(job);
  } catch (error) {
    console.error("Error getting job:", error);
    res.status(404).send("Job not found");
  }
});

router.post("/", upload.single("gambar"), uploadImage, async (req, res) => {
  try {
    const file = req.file;
    const imageUrl = file ? file.cloudinary.secure_url : null;

    const newJobData = {
      ...req.body,
      gambar: imageUrl,
      persyaratan: cleanAndParseArrayString(req.body.persyaratan),
      openrekrutmen: cleanAndParseArrayString(req.body.openrekrutmen),
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

router.put("/:id", upload.single("gambar"), uploadImage, async (req, res) => {
  try {
    const jobId = req.params.id;
    const file = req.file;

    const oldJob = await GetJobsById(jobId);
    if (!oldJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    let imageUrl = oldJob.gambar;
    if (file) {
      // Delete old image if exists
      if (oldJob.gambar) {
        const publicId = oldJob.gambar.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
      }
      // Upload new image
      imageUrl = file.cloudinary.secure_url;
    }

    const updatedJobData = {
      ...req.body,
      gambar: imageUrl,
      persyaratan: cleanAndParseArrayString(req.body.persyaratan),
      openrekrutmen: cleanAndParseArrayString(req.body.openrekrutmen),
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

    // Retrieve the job record to get the publicId
    const job = await GetJobsById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Extract the publicId from the image URL and decode URL components
    const publicId = job.gambar ? `lamaran/${decodeURIComponent(job.gambar.split('/').pop().split('.')[0])}` : null;

    if (!publicId) {
      return res.status(400).json({ message: "No image found to delete" });
    }

    console.log(`Attempting to delete image with public_id: ${publicId}`);

    // Delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    console.log('Cloudinary delete result:', result);

    if (result.result !== 'ok' && result.result !== 'not found') {
      throw new Error(`Failed to delete image from Cloudinary: ${result.error?.message || 'Unknown error'}`);
    }

    // Delete related applications and saved jobs
    await DeleteApplicationsByJobId(jobId);
    await DeleteSavedApplicationsByJobId(jobId);

    // Delete the job record
    const deletedJob = await DeleteJobsById(jobId);

    res.status(200).json({
      data: deletedJob,
      message: "Job successfully deleted",
    });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(400).json({
      message: "Failed to delete job",
      error: error.message || 'An unexpected error occurred',
    });
  }
});

module.exports = router;
