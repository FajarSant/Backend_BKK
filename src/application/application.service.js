const prisma = require("../db");

const GetAllLamaran = async () => {
    try {
      const lamaran = await prisma.lamaran.findMany({
        select: {
          id: true,
          penggunaId: true,
          pekerjaanId: true,
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
          status: true,
          tanggalDibuat: true,
        },
      });
  
      return lamaran;
    } catch (error) {
      throw new Error(`Failed to get lamaran: ${error.message}`);
    }
  };
  
const GetLamaranById = async (id) => {
  try {
    const lamaran = await prisma.lamaran.findUnique({
      where: {
        id: id,
      },
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

    return lamaran;
  } catch (error) {
    throw new Error(`Failed to get lamaran: ${error.message}`);
  }
};

const CreateLamaran = async (lamaranData) => {
    // Check if the related pengguna and pekerjaan exist
    const pengguna = await prisma.pengguna.findUnique({
      where: {
        id: lamaranData.penggunaId,
      },
    });
  
    if (!pengguna) {
      throw new Error(`Pengguna dengan ID ${lamaranData.penggunaId} tidak ditemukan`);
    }
  
    const pekerjaan = await prisma.pekerjaan.findUnique({
      where: {
        id: lamaranData.pekerjaanId,
      },
    });
  
    if (!pekerjaan) {
      throw new Error(`Pekerjaan dengan ID ${lamaranData.pekerjaanId} tidak ditemukan`);
    }
  
    const createdLamaran = await prisma.lamaran.create({
      data: {
        status: lamaranData.status,
        tanggalDibuat: lamaranData.tanggalDibuat,
        pengguna: {
          connect: {
            id: lamaranData.penggunaId,
          },
        },
        pekerjaan: {
          connect: {
            id: lamaranData.pekerjaanId,
          },
        },
      },
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
  
    return createdLamaran;
  };
  

const UpdateLamaranById = async (id, lamaranData) => {
  try {
    const updatedLamaran = await prisma.lamaran.update({
      where: {
        id: id,
      },
      data: lamaranData,
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

    return updatedLamaran;
  } catch (error) {
    throw new Error(`Failed to update lamaran: ${error.message}`);
  }
};

const DeleteLamaranById = async (id) => {
  try {
    const deletedLamaran = await prisma.lamaran.delete({
      where: {
        id: id,
      },
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

    return deletedLamaran;
  } catch (error) {
    throw new Error(`Failed to delete lamaran: ${error.message}`);
  }
};

module.exports = {
  GetAllLamaran,
  GetLamaranById,
  CreateLamaran,
  UpdateLamaranById,
  DeleteLamaranById,
};
