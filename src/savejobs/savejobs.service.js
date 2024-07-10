const prisma = require('../db');

const getLowonganTersimpanById = async (id) => {
  return await prisma.lowonganTersimpan.findUnique({
    where: { id },
    include: {
      pekerjaan: true,
      pengguna: true,
    },
  });
};

const getAllLowonganTersimpan = async () => {
  return await prisma.lowonganTersimpan.findMany({
    include: {
      pekerjaan: {
        select: {
          judul: true, // Ubah menjadi field yang valid seperti judul
          // Pilih field lainnya dari pekerjaan sesuai kebutuhan
        },
      },
      pengguna: {
        select: {
          nama: true,
        },
      },
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
};
