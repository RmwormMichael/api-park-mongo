const express = require('express');
const router = express.Router();
const movCtrl = require('../controllers/movimientoController');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const { entradaRules, salidaRules, rangeRules } = require('../middlewares/validators');

router.post(
  '/entrada',
  authenticate,
  authorize('Administrador', 1, 'Vigilante', 5),
  entradaRules,
  movCtrl.entrada
);

router.post(
  '/salida',
  authenticate,
  authorize('Administrador', 1, 'Vigilante', 5),
  salidaRules,
  movCtrl.salida
);

router.get('/range', authenticate, rangeRules, movCtrl.listByRange);

router.get('/', authenticate, authorize('Administrador', 1, 'Vigilante', 5), movCtrl.listAll);

router.get('/dentro', authenticate, authorize('Administrador', 1, 'Vigilante', 5), movCtrl.vehiculosDentro);

module.exports = router;
