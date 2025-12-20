const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Asegurar que existe la carpeta uploads/vehicles
const uploadDir = path.join(__dirname, '..', 'uploads', 'vehicles');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'vehicle-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtrar solo imágenes
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
  }
};

const uploadVehicle = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB para fotos de vehículos
  fileFilter: fileFilter
});

module.exports = uploadVehicle;