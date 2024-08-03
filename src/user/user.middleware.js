const multer = require('multer');
const cloudinary = require('../config/Cloudinary');
const streamifier = require('streamifier');


const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB file size limit
  }
});

const uploadImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const uploadStream = (file, publicId) => {
    return new Promise((resolve, reject) => {
      const upload_stream = cloudinary.uploader.upload_stream(
        {
          folder: 'users',
          allowed_formats: ['jpg', 'jpeg', 'png'],
          public_id: publicId
        },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );
      streamifier.createReadStream(file.buffer).pipe(upload_stream);
    });
  };

  const publicId = req.body.NIS ? `${req.body.NIS.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-]/g, '')}` : 'defaultNIS';
  uploadStream(req.file, publicId)
    .then(result => {
      req.file.cloudinary = result;
      next();
    })
    .catch(error => {
      console.error("Error uploading image to Cloudinary:", error);
      next(error);
    });
};


module.exports = {
  uploadImage,
  upload,
};
