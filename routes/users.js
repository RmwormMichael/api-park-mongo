const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const ownership = require('../middlewares/ownership');
const upload = require('../middlewares/upload');

// Listar usuarios (solo admin)
router.get('/', authenticate, authorize('Administrador'), userCtrl.list);
router.get('/:id', authenticate, authorize('Administrador', 'Instructor', 'Aprendiz', 'Visitante', 'Vigilante'), ownership({ source: 'params', field: 'id', authUserField: 'id', allowRoles: ['Administrador'] }), userCtrl.get);
router.get('/:id/vehicles', authenticate, authorize('Administrador', 'Instructor', 'Aprendiz', 'Visitante', 'Vigilante'), ownership({ source: 'params', field: 'id', authUserField: 'id', allowRoles: ['Administrador'] }), userCtrl.getUserVehicles);
router.put('/:id', authenticate, authorize('Administrador', 'Instructor', 'Aprendiz', 'Visitante', 'Vigilante'), ownership({ source: 'params', field: 'id', authUserField: 'id', allowRoles: ['Administrador'] }), upload.single('fotoPerfil'), userCtrl.update);
router.delete('/:id', authenticate, authorize('Administrador'), ownership({ source: 'params', field: 'id', authUserField: 'id', allowRoles: ['Administrador'] }), userCtrl.remove);

module.exports = router;
