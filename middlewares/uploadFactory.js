const multer = require('multer');
const path = require('path');
const fs = require('fs');

function createUploadMiddleware({ subfolder, prefix, allowedTypes, maxSize }) {
  const uploadDir = path.join(__dirname, '..', 'uploads', subfolder || '');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, prefix + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  const fileFilter = (req, file, cb) => {
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Formato de imagen no permitido'));
    }
  };

  return multer({
    storage,
    limits: { fileSize: maxSize },
    fileFilter
  });
}

module.exports = { createUploadMiddleware };
