const prisma = require("../db");
const fs = require('fs');
const path = require('path');

// Fetch all pelatihan
const GetAllPelatihan = async () => {
  return await prisma.pelatihan.findMany({
    select: {
      id: true,
      namapelatihan: true,
      gambar: true,
      deskripsi: true,
      administrasi: true,
      skills: true,
      alamat: true,
      fasilitas: true,
      nomortelepon: true,
      email: true,
      Link: true,
      tanggalDibuat: true,
    },
  });
};

// Fetch pelatihan by ID
const GetPelatihanById = async (pelatihanId) => {
  try {
    return await prisma.pelatihan.findUnique({
      where: { id: pelatihanId },
    });
  } catch (error) {
    throw new Error(`Failed to get pelatihan by id: ${error.message}`);
  }
};

// Create new pelatihan
const CreatePelatihan = async (pelatihanData) => {
  try {
    // Convert fields that should be arrays from comma-separated strings to arrays
    const skills = Array.isArray(pelatihanData.skills) ? pelatihanData.skills : pelatihanData.skills.split(',').map(item => item.trim());
    const fasilitas = Array.isArray(pelatihanData.fasilitas) ? pelatihanData.fasilitas : pelatihanData.fasilitas.split(',').map(item => item.trim());

    // Validate and set default values for fields if necessary
    const newPelatihanData = {
      namapelatihan: pelatihanData.namapelatihan,
      gambar: pelatihanData.gambar,
      alamat: pelatihanData.alamat,
      deskripsi: pelatihanData.deskripsi,
      administrasi: pelatihanData.administrasi || "",
      skills: skills,
      fasilitas: fasilitas,
      email: pelatihanData.email,
      nomortelepon: pelatihanData.nomortelepon || "",
      Link: pelatihanData.Link || "",
    };

    return await prisma.pelatihan.create({
      data: newPelatihanData,
    });
  } catch (error) {
    throw new Error(`Failed to create pelatihan: ${error.message}`);
  }
};

// Update pelatihan
const UpdatePelatihan = async (id, pelatihanData) => {
  try {
    const existingPelatihan = await prisma.pelatihan.findUnique({
      where: { id },
    });

    if (!existingPelatihan) {
      throw new Error("Pelatihan not found");
    }

    // Handle image update
    let newImageUrl = pelatihanData.gambar || existingPelatihan.gambar;
    if (pelatihanData.gambar && existingPelatihan.gambar && existingPelatihan.gambar !== pelatihanData.gambar) {
      // Delete old image
      const oldImagePath = path.join(__dirname, `../uploads/pelatihan/${path.basename(existingPelatihan.gambar)}`);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    } else if (!pelatihanData.gambar && existingPelatihan.gambar) {
      // Remove image if new image is not provided
      const oldImagePath = path.join(__dirname, `../uploads/pelatihan/${path.basename(existingPelatihan.gambar)}`);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      newImageUrl = null; // Remove image URL from database
    }

    const updatedPelatihanData = {
      namapelatihan: pelatihanData.namapelatihan || existingPelatihan.namapelatihan,
      gambar: newImageUrl,
      alamat: pelatihanData.alamat || existingPelatihan.alamat,
      deskripsi: pelatihanData.deskripsi || existingPelatihan.deskripsi,
      administrasi: pelatihanData.administrasi || existingPelatihan.administrasi,
      skills: Array.isArray(pelatihanData.skills) ? pelatihanData.skills : pelatihanData.skills.split(',').map(item => item.trim()) || existingPelatihan.skills,
      fasilitas: Array.isArray(pelatihanData.fasilitas) ? pelatihanData.fasilitas : pelatihanData.fasilitas.split(',').map(item => item.trim()) || existingPelatihan.fasilitas,
      email: pelatihanData.email || existingPelatihan.email,
      nomortelepon: pelatihanData.nomortelepon || existingPelatihan.nomortelepon,
      Link: pelatihanData.Link || existingPelatihan.Link,
    };

    return await prisma.pelatihan.update({
      where: { id },
      data: updatedPelatihanData,
    });
  } catch (error) {
    throw new Error(`Failed to update pelatihan: ${error.message}`);
  }
};

// Delete pelatihan
const DeletePelatihan = async (id) => {
    try {
      // Find the pelatihan record
      const pelatihan = await prisma.pelatihan.findUnique({
        where: { id },
      });
  
      if (!pelatihan) {
        throw new Error("Pelatihan not found");
      }
  
      // Delete image file if it exists
      if (pelatihan.gambar) {
        const imageFileName = path.basename(pelatihan.gambar);
        const imagePath = path.resolve(__dirname, `../../uploads/pelatihan/${imageFileName}`);
  
        console.log(`Attempting to delete image at: ${imagePath}`); // Log for debugging
  
        try {
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log(`Image successfully deleted: ${imagePath}`); // Log for debugging
          } else {
            console.log(`Image file does not exist: ${imagePath}`); // Log for debugging
          }
        } catch (fsError) {
          console.error(`Error deleting image file: ${fsError.message}`); // Log file system errors
          throw new Error(`Error deleting image file: ${fsError.message}`);
        }
      }
  
      // Delete pelatihan record
      await prisma.pelatihan.delete({
        where: { id },
      });
  
      return { message: "Pelatihan successfully deleted" };
    } catch (error) {
      throw new Error(`Failed to delete pelatihan: ${error.message}`);
    }
  };
  

module.exports = {
  GetAllPelatihan,
  GetPelatihanById,
  CreatePelatihan,
  UpdatePelatihan,
  DeletePelatihan,
};
