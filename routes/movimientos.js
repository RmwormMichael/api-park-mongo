const express = require('express');
const router = express.Router();
const movCtrl = require('../controllers/movimientoController');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

// Registrar entrada (solo admin y vigilante)
router.post(
  '/entrada',
  authenticate,
  authorize('Administrador', 1, 'Vigilante', 5),
  movCtrl.entrada
);

// Registrar salida (solo admin y vigilante)
router.post(
  '/salida',
  authenticate,
  authorize('Administrador', 1, 'Vigilante', 5),
  movCtrl.salida
);

// Rango de fechas (todos pueden ver)
router.get('/range', authenticate, movCtrl.listByRange);

// Listar todos los movimientos (solo admin y vigilante)
router.get('/', authenticate, authorize('Administrador', 1, 'Vigilante', 5), movCtrl.listAll);

// Vehículos dentro (solo admin y vigilante)
router.get('/dentro', authenticate, authorize('Administrador', 1, 'Vigilante', 5), movCtrl.vehiculosDentro);

module.exports = router;
