const prisma = require("../db");

const GetAllJobs = async () => {
  const jobs = await prisma.pengguna.findMany({
    select: {
      id: true,
      nama: true,
      peran: true,
      jurusan: true,
    },
  });

  return jobs;
};

const GetJobsById = async (id) => {
  try {
    const jobs = await prisma.pengguna.findUnique({
      where: {
        id: id,
      },
    });
    if (!jobs) {
      return null;
    }

    return jobs;
  } catch (error) {
    throw new Error(`Failed to get jobs: ${error.message}`);
  }
};

const CreateJobs = async (jobsData) => {
  const jobs = await prisma.pengguna.create({
    data: jobsData,
  });
  return jobs;
};

const UpdateJobsById = async (id, jobsData) => {
  try {
    const updatedJobs = await prisma.pengguna.update({
      where: {
        id: id // Gunakan id dari argumen fungsi
      },
      data: jobsData // Gunakan data yang diterima dari argumen fungsi
    });

    return updatedJobs;
  } catch (error) {
    throw new Error(`Failed to update jobs: ${error.message}`);
  }
};


const DeleteJobsById = async (id) => {
  try {
    const deletedJobs = await prisma.pengguna.delete({
      where: {
        id: id,
      },
    });
    return deletedJobs;
  } catch (error) {
    throw new Error(`Failed to delete jobs: ${error.message}`);
  }
};

module.exports = {
  GetAllJobs,
  GetJobsById,
  CreateJobs,
  UpdateJobsById,
  DeleteJobsById,
};
