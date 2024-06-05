const prisma = require("../db");

const GetAllPerusahaan = async () => {
  const perusahaan = await prisma.perusahaan.findMany({
    select: {
      id: true,
      nama: true,
      deskripsi: true,
      alamat: true,
      
    },
  });

  return perusahaan;
};

const GetPerusahaanById = async (id) => {
  try {
    const perusahaan = await prisma.perusahaan.findUnique({
      where: {
        id: id,
      },
    });
    if (!perusahaan) {
      return null;
    }

    return perusahaan;
  } catch (error) {
    throw new Error(`Failed to get perusahaan: ${error.message}`);
  }
};

const CreatePerusahaan = async (perusahaanData) => {
  const perusahaan = await prisma.perusahaan.create({
    data: perusahaanData,
  });
  return perusahaan;
};

const UpdatePerusahaanById = async (id, perusahaanData) => {
  try {
    const updatedPerusahaan = await prisma.perusahaan.update({
      where: {
        id: id,
      },
      data: perusahaanData,
    });

    return updatedPerusahaan;
  } catch (error) {
    throw new Error(`Failed to update perusahaan: ${error.message}`);
  }
};

const DeletePerusahaanById = async (id) => {
  try {
    const deletedPerusahaan = await prisma.perusahaan.delete({
      where: {
        id: id,
      },
    });
    return deletedPerusahaan;
  } catch (error) {
    throw new Error(`Failed to delete perusahaan: ${error.message}`);
  }
};

module.exports = {
  GetAllPerusahaan,
  GetPerusahaanById,
  CreatePerusahaan,
  UpdatePerusahaanById,
  DeletePerusahaanById,
};
