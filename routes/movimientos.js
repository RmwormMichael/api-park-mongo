const express = require('express');
const router = express.Router();
const movCtrl = require('../controllers/movimientoController');
const authenticate = require('../middlewares/auth');
const permit = require('../middlewares/roles');

// Registrar entrada (solo admin y vigilante)
router.post(
  '/entrada',
  authenticate,
  permit('Administrador', 1, 'Vigilante', 5),
  movCtrl.entrada
);

// Registrar salida (solo admin y vigilante)
router.post(
  '/salida',
  authenticate,
  permit('Administrador', 1, 'Vigilante', 5),
  movCtrl.salida
);

// Rango de fechas (todos pueden ver)
router.get('/range', authenticate, movCtrl.listByRange);

// Listar todos los movimientos (solo admin y vigilante)
router.get('/', authenticate, permit('Administrador', 1, 'Vigilante', 5), movCtrl.listAll);

// Vehículos dentro (solo admin y vigilante)
router.get('/dentro', authenticate, permit('Administrador', 1, 'Vigilante', 5), movCtrl.vehiculosDentro);

module.exports = router;
