const prisma = require("../db");

const GetAllJobs = async () => {
  const jobs = await prisma.pekerjaan.findMany({
    select: {
      id: true,
      gambar: true,
      namaPT:true,
      deskripsi:true,
      persyaratan:true,
      openrekrutmen:true,
      alamat:true,
      nomorTelepon:true,
      email:true,
      Link:true,
      berkas:true
    },
  });

  return jobs;
};

const GetJobsById = async (jobId) => {
  try {
    return await prisma.pekerjaan.findUnique({
      where: { id: jobId },
    });
  } catch (error) {
    throw new Error(`Failed to get job by id: ${error.message}`);
  }
};

const CreateJobs = async (jobData) => {
  try {
    const newJob = await prisma.pekerjaan.create({
      data: {
        namaPT: jobData.namaPT,
        deskripsi: jobData.deskripsi,
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
    return await prisma.pekerjaan.update({
      where: { id: jobId },
      data: jobData,
    });
  } catch (error) {
    throw new Error(`Failed to update job: ${error.message}`);
  }
};

const DeleteJobsById = async (jobId) => {
  try {
    return await prisma.pekerjaan.delete({
      where: {
        id: jobId,
      },
    });
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
};
