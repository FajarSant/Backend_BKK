const multer = require('multer');
const cloudinary = require('../config/Cloudinary');
const streamifier = require('streamifier');

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB file size limit
  },
});

const uploadImage = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const uploadStream = (file, publicId) => {
    return new Promise((resolve, reject) => {
      const upload_stream = cloudinary.uploader.upload_stream(
        {
          folder: 'lamaran',
          allowed_formats: ['jpg', 'jpeg', 'png'],
          public_id: publicId, // Use publicId as filename
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

  // Use a more unique identifier for filename, replacing spaces and special characters
  const publicId = req.body.namaPT ? `${req.body.namaPT.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-]/g, '')}` : 'lamaran/defaultPT';
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

const cleanAndParseArrayString = (inputString) => {
  if (!inputString) return [];

  try {
    // Remove any leading or trailing quotes
    let cleanedString = inputString.trim().replace(/^"|"$/g, '');

    // Convert the string to a proper JSON array format
    if (!cleanedString.startsWith('[')) {
      cleanedString = `[${cleanedString}]`;
    }

    // Parse the JSON string into an array
    const array = JSON.parse(cleanedString);
    
    // Ensure the result is an array
    if (!Array.isArray(array)) {
      throw new Error("Parsed result is not an array");
    }

    return array;
  } catch (error) {
    console.error("Error parsing array string:", error);
    return [];
  }
};

module.exports = {
  uploadImage,
  upload,
  cleanAndParseArrayString,
};
