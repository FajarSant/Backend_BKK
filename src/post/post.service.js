const prisma = require("../db");

const GetALLPosts = async () => {
  const posts = await prisma.posts.findMany();

  return posts;
};

const GetPostById = async (id) => {
  if (typeof id !== "number") {
    throw new Error("ID Not a Number");
  }

  const posts = await prisma.posts.findUnique({
    where: {
      id,
    },
  });

  return posts;
};

const CreatePost = async (postData) => {
  const post = await prisma.posts.create({
    data: {
        image: postData.image,
        nama: postData.nama,
        hashtag: postData.hashtag,
        deskripsisingkat: postData.deskripsisingkat,
        deskripsipanjang: postData.deskripsipanjang,
        alamat: postData.alamat,
        email: postData.email,
        waktu: postData.waktu,
        genre: postData.genre,
    },
  });
  return post;
};

const DeletePostById = async (id) => {
  try {
    const post = await prisma.posts.findUnique({
      where: {
        id,
      },
    });

    if (!post) {
      throw new Error("post not found");
    }
    const DeletedPost = await prisma.posts.delete({
      where: {
        id,
      },
    });

    return DeletedPost; // Kembalikan pengguna yang dihapus
  } catch (error) {
    throw error;
  }
};

const EditPostById = async (id, postData) => {
  const post = await prisma.posts.update({
    where: {
      id: Number(id), // Menggunakan parameter 'id' yang diterima dari fungsi
    },
    data: {
      image: postData.image,
      nama: postData.nama,
      hashtag: postData.hashtag,
      deskripsisingkat: postData.deskripsisingkat,
      deskripsipanjang: postData.deskripsipanjang,
      alamat: postData.alamat,
      email: postData.email,
      waktu: postData.waktu,
      genre: postData.genre,
    },
  });
  return post;
};


module.exports = {
    GetALLPosts,
    GetPostById,
    CreatePost,
    DeletePostById,
    EditPostById
}