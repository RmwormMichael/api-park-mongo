const express = require('express');
const router = express.Router();
const repCtrl = require('../controllers/reporteController');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

// Generar reporte (POST para crear reporte)
router.post('/', 
  authenticate,
  authorize('Administrador', 'Vigilante'),
  repCtrl.createAndGenerate
);

// Generar reporte (GET para consultar)
router.get('/', 
  authenticate,
  authorize('Administrador', 'Vigilante', 'Instructor'),
  repCtrl.generateOnly
);

// Estadísticas rápidas
router.get('/stats', 
  authenticate,
  authorize('Administrador', 'Vigilante'),
  repCtrl.getStats
);

module.exports = router;