const express = require('express');
const router = express.Router();
const vehicleCtrl = require('../controllers/vehicleController');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const uploadVehicle = require('../middlewares/uploadVehicle');
const { vehicleRules, vehicleDeleteRules } = require('../middlewares/validators');

router.post(
  '/',
  authenticate,
  authorize('Administrador', 'Instructor', 'Aprendiz', 'Visitante', 'Vigilante'),
  uploadVehicle.single('fotoVehiculo'),
  vehicleRules,
  vehicleCtrl.create
);

router.get('/user', authenticate, authorize('Administrador', 'Instructor', 'Aprendiz', 'Visitante', 'Vigilante'), vehicleCtrl.listByUser);

router.get('/', authenticate, authorize('Administrador', 'Vigilante'), vehicleCtrl.listAll);

router.delete('/:id', authenticate, authorize('Administrador', 'Vigilante'), vehicleDeleteRules, vehicleCtrl.remove);

module.exports = router;
