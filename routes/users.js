const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const authenticate = require('../middlewares/auth');
const permit = require('../middlewares/roles');
const upload = require('../middlewares/upload');

// Listar usuarios (solo admin)
router.get('/', authenticate, permit('Administrador', 1), userCtrl.list);
router.get('/:id', authenticate, userCtrl.get);
router.get('/:id/vehicles', authenticate, userCtrl.getUserVehicles);
router.put('/:id', authenticate, upload.single('fotoPerfil'), userCtrl.update);
router.delete('/:id', authenticate, permit('Administrador', 1), userCtrl.remove);

module.exports = router;
