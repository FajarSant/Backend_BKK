const express = require ("express");
const prisma = require ("../db");

const {
    GetALLPosts,
    GetPostById,
    CreatePost,
    DeletePostById,
    EditPostById,
  } = require("./post.service");


const router = express.Router();

router.get("/", async (req, res) => {
    const posts = await GetALLPosts();
  
    res.send(posts);
  });
  
  router.get("/:id", async (req, res) => {
      try {
        const postId = parseInt(req.params.id);
        
        // Panggil fungsi GetpostById dengan ID yang diberikan
        const post = await GetPostById(postId);
        
        // Jika pengguna tidak ditemukan, lempar kesalahan
        if (!post) {
          throw new Error("post Not Found");
        }
        
        // Kirim pengguna sebagai respons
        res.send(post);
      } catch (error) {
        console.error("Error getting post:", error);
        res.status(404).send("post not found");
      }
    });
  
  router.post("/", async (req, res) => {
    try {
      const newpostData = req.body;
      const post = await CreatePost(newpostData);
  
      res.send({
        data: post,
        message: "post Berhasil Dibuat",
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  });
  
  router.delete("/:id", async (req, res) => {
      try {
        const postId = parseInt(req.params.id);
        
        await DeletePostById(postId);
    
        res.send("post Telah Dihapus");
      } catch (error) {
       res.status(400).send(error.message)
      }
    });
  
  router.put("/:id", async (req, res) => {
    const postsid = req.params.id;
    const postsData = req.body;
  
    if (
      !(
        postsData.image &
        postsData.nama &
        postsData.jeniskelamin &
        postsData.post &
        postsData.email &
        postsData.password &
        postsData.alamat &
        postsData.tempat &
        postsData.tanggalLahir 
      )
    ) {
      return res.status(401).send("some fields are missing");
    }
  
    const post = await EditPostById(parseInt (postsid), postsData);
    res.send({
      data: post,
      message: "posts Berhasil Diedit",
    });
  });
  
  router.patch("/:id", async (req, res) => {
      try {
        const postId = parseInt(req.params.id);
        const postData = req.body;
    
        // Panggil fungsi EditpostById untuk mengedit pengguna berdasarkan ID dan data yang diberikan
        const post = await EditPostById(postId, postData);
    
        // Kirim respons dengan data pengguna yang telah diperbarui
        res.send({
          data: post,
          message: "post Berhasil Diedit",
        });
      } catch (error) {
        // Tangani kesalahan dan kirim pesan kesalahan yang sesuai
        console.error("Error editing post:", error);
        res.status(400).send(error.message);
      }
    });
  
  module.exports = router;