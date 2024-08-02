const prisma = require("../db");

const GetAllJobs = async () => {
  try {
    const jobs = await prisma.pekerjaan.findMany({
      select: {
        id: true,
        gambar: true,
        namaPT: true,
        deskripsi: true,
        persyaratan: true,
        openrekrutmen: true,
        tanggalDibuat: true,
        alamat: true,
        jenis: true,
        nomorTelepon: true,
        email: true,
        Link: true,
        berkas: true
      },
    });
    return jobs;
  } catch (error) {
    throw new Error(`Failed to get all jobs: ${error.message}`);
  }
};

const GetJobsById = async (jobId) => {
  try {
    if (!jobId) throw new Error('Job ID is required');
    return await prisma.pekerjaan.findUnique({
      where: { id: jobId },
    });
  } catch (error) {
    throw new Error(`Failed to get job by ID: ${error.message}`);
  }
};

const CreateJobs = async (jobData) => {
  try {
    if (!jobData) throw new Error('Job data is required');
    const newJob = await prisma.pekerjaan.create({
      data: {
        namaPT: jobData.namaPT,
        deskripsi: jobData.deskripsi,
        jenis: jobData.jenis,
        berkas: jobData.berkas,
        persyaratan: jobData.persyaratan,
        openrekrutmen: jobData.openrekrutmen,
        gambar: jobData.gambar,
        alamat: jobData.alamat,
        email: jobData.email,
        nomorTelepon: jobData.nomorTelepon,
        Link: jobData.Link,
      },
    });
    return newJob;
  } catch (error) {
    throw new Error(`Failed to create job: ${error.message}`);
  }
};

const UpdateJobsById = async (jobId, jobData) => {
  try {
    if (!jobId) throw new Error('Job ID is required');
    if (!jobData) throw new Error('Job data is required');
    return await prisma.pekerjaan.update({
      where: { id: jobId },
      data: jobData,
    });
  } catch (error) {
    throw new Error(`Failed to update job: ${error.message}`);
  }
};

const DeleteApplicationsByJobId = async (jobId) => {
  try {
    if (!jobId) throw new Error('Job ID is required');
    return await prisma.lamaran.deleteMany({
      where: {
        pekerjaanId: jobId,
      },
    });
  } catch (error) {
    throw new Error(`Failed to delete applications: ${error.message}`);
  }
};

const DeleteSavedApplicationsByJobId = async (jobId) => {
  try {
    if (!jobId) throw new Error('Job ID is required');
    return await prisma.lowonganTersimpan.deleteMany({
      where: {
        pekerjaanId: jobId,
      },
    });
  } catch (error) {
    throw new Error(`Failed to delete saved applications: ${error.message}`);
  }
};

const DeleteJobsById = async (jobId) => {
  try {
    if (!jobId) throw new Error('Job ID is required');

    const job = await prisma.pekerjaan.findUnique({
      where: { id: jobId },
    });

    if (!job) throw new Error('Job not found');

    await DeleteApplicationsByJobId(jobId);
    await DeleteSavedApplicationsByJobId(jobId);

    if (job.fileId) {
      await deleteFromGoogleDrive(job.fileId);
    }

    const deletedJob = await prisma.pekerjaan.delete({
      where: { id: jobId },
    });

    return deletedJob;
  } catch (error) {
    throw new Error(`Failed to delete job: ${error.message}`);
  }
};

module.exports = {
  GetAllJobs,
  GetJobsById,
  CreateJobs,
  UpdateJobsById,
  DeleteJobsById,
  DeleteApplicationsByJobId,
  DeleteSavedApplicationsByJobId,
};
