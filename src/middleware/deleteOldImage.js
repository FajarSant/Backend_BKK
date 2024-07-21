const fs = require('fs');
const path = require('path');

const deleteOldImage = (imagePath) => {
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }
};
