const express = require('express');
const router = express.Router();
const vehicleCtrl = require('../controllers/vehicleController');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const uploadVehicle = require('../middlewares/uploadVehicle'); // Nueva importación

// Crear vehículo CON foto
router.post(
  '/',
  authenticate,
  authorize('Administrador', 'Instructor', 'Aprendiz', 'Visitante', 'Vigilante'),
  uploadVehicle.single('fotoVehiculo'),
  vehicleCtrl.create
);

// Vehículos del usuario autenticado
router.get('/user', authenticate, authorize('Administrador', 'Instructor', 'Aprendiz', 'Visitante', 'Vigilante'), vehicleCtrl.listByUser);

// Listar todos los vehículos (solo admin y vigilante)
router.get('/', authenticate, authorize('Administrador', 'Vigilante'), vehicleCtrl.listAll);

// Eliminar vehículo
router.delete('/:id', authenticate, authorize('Administrador', 'Vigilante'), vehicleCtrl.remove);

module.exports = router;