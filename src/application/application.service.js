const prisma = require("../db");

const getLamaranById = async (id) => {
  return await prisma.lamaran.findUnique({
    where: { id },
    include: {
      pengguna: {
        select: {
          nama: true,
        },
      },
      pekerjaan: {
        select: {
          judul: true,
        },
      },
    },
  });
};

const getAllLamaran = async () => {
  return await prisma.lamaran.findMany({
    select: {
      id: true,
      penggunaId: true,
      pekerjaanId: true,
      status: true,
      tanggalDibuat: true,
      pengguna: {
        select: {
          nama: true,
        },
      },
      pekerjaan: {
        select: {
          judul: true,
        },
      },
    },
  });
};

const updateLamaran = async (id, data) => {
  return await prisma.lamaran.update({
    where: { id },
    data,
  });
};

const deleteLamaran = async (id) => {
  return await prisma.lamaran.delete({
    where: { id },
  });
};

module.exports = {
  getLamaranById,
  getAllLamaran,
  deleteLamaran,
  updateLamaran,
};