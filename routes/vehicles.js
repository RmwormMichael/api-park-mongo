const express = require('express');
const router = express.Router();
const vehicleCtrl = require('../controllers/vehicleController');
const authenticate = require('../middlewares/auth');
const permit = require('../middlewares/roles');
const uploadVehicle = require('../middlewares/uploadVehicle'); // Nueva importación

// Crear vehículo CON foto
router.post('/', authenticate, uploadVehicle.single('fotoVehiculo'), vehicleCtrl.create);

// Vehículos del usuario autenticado
router.get('/user', authenticate, vehicleCtrl.listByUser);

// Listar todos los vehículos (solo admin y vigilante)
router.get('/', authenticate, permit('Administrador', 1, 'Vigilante', 5), vehicleCtrl.listAll);

// Eliminar vehículo
router.delete('/:id', authenticate, vehicleCtrl.remove);

module.exports = router;