const prisma = require('../db');

// Get LowonganTersimpan by ID with related Pekerjaan and Pengguna
const getLowonganTersimpanById = async (id) => {
  return await prisma.lowonganTersimpan.findUnique({
    where: { id },
    include: {
      pekerjaan: true,
      pengguna: true,
    },
  });
};

// Get all LowonganTersimpan records with related Pekerjaan and Pengguna
const getAllLowonganTersimpan = async () => {
  return await prisma.lowonganTersimpan.findMany({
    include: {
      pekerjaan: {
        select: {
          namaPT: true, // Select fields from pekerjaan as needed
          // Other fields from pekerjaan if needed
        },
      },
      pengguna: {
        select: {
          nama: true, // Select fields from pengguna as needed
        },
      },
    },
  });
};

const findLowonganTersimpan = async ({ pekerjaanId, penggunaId }) => {
  return await prisma.lowonganTersimpan.findFirst({
    where: {
      AND: [
        { pekerjaanId: pekerjaanId },
        { penggunaId: penggunaId }
      ]
    },
  });
};

const createLowonganTersimpan = async (data) => {
  return await prisma.lowonganTersimpan.create({
    data,
    include: {
      pekerjaan: true,
      pengguna: true,
    },
  });
};



// Update LowonganTersimpan by ID
const updateLowonganTersimpan = async (id, data) => {
  return await prisma.lowonganTersimpan.update({
    where: { id },
    data,
    include: {
      pekerjaan: true,
      pengguna: true,
    },
  });
};

// Delete LowonganTersimpan by ID
const deleteLowonganTersimpan = async (id) => {
  return await prisma.lowonganTersimpan.delete({
    where: { id },
  });
};

module.exports = {
  getLowonganTersimpanById,
  getAllLowonganTersimpan,
  createLowonganTersimpan,
  updateLowonganTersimpan,
  deleteLowonganTersimpan,
  findLowonganTersimpan,
};
