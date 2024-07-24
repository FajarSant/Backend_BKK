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
          namaPT: true,
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
          namaPT: true,
        },
      },
    },
  });
};
const getLamaranByPenggunaId = async (penggunaId) => {
  return await prisma.lamaran.findFirst({
    where: {
      penggunaId,
      status: { not: "DIKIRIM" } // atau status lain yang menunjukkan lamaran masih aktif
    },
  });
};
const createLamaran = async (data) => {
  const existingLamaran = await getLamaranByPenggunaId(data.penggunaId);
  if (existingLamaran) {
    throw new Error('User already has an active lamaran.');
  }

  // Validate and clean IDs
  const pekerjaanId = data.pekerjaanId.trim().replace(/[^a-fA-F0-9]/g, '');
  const penggunaId = data.penggunaId.trim().replace(/[^a-fA-F0-9]/g, '');

  // Check if IDs have the correct length for ObjectID (24 characters for MongoDB)
  if (pekerjaanId.length !== 24 || penggunaId.length !== 24) {
    throw new Error('Invalid ID format.');
  }

  return await prisma.lamaran.create({
    data: {
      pekerjaanId,
      penggunaId,
      status: "DIKIRIM", // Ensure this matches one of the enum values
    },
    include: {
      pekerjaan: true,
      pengguna: true,
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
  getLamaranByPenggunaId,
  getLamaranById,
  getAllLamaran,
  createLamaran,
  deleteLamaran,
  updateLamaran,
};
