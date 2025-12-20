const express = require('express');
const router = express.Router();
const repCtrl = require('../controllers/reporteController');
const authenticate = require('../middlewares/auth');
const permit = require('../middlewares/roles'); // Si quieres restringir por roles

// Generar reporte (POST para crear reporte)
router.post('/', 
  authenticate, 
  // permit('Administrador', 1, 'Vigilante', 5), // Opcional: restringir por rol
  repCtrl.createAndGenerate
);

// Generar reporte (GET para consultar)
router.get('/', 
  authenticate, 
  // permit('Administrador', 1, 'Vigilante', 5, 'Instructor', 2), // Opcional
  repCtrl.generateOnly
);

// Estadísticas rápidas
router.get('/stats', 
  authenticate, 
  repCtrl.getStats
);

module.exports = router;