const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userController');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const ownership = require('../middlewares/ownership');
const upload = require('../middlewares/upload');
const { userIdRules, userUpdateRules, userDeleteRules } = require('../middlewares/validators');

router.get('/', authenticate, authorize('Administrador'), userCtrl.list);
router.get('/:id', authenticate, authorize('Administrador', 'Instructor', 'Aprendiz', 'Visitante', 'Vigilante'), userIdRules, ownership({ source: 'params', field: 'id', authUserField: 'id', allowRoles: ['Administrador'] }), userCtrl.get);
router.get('/:id/vehicles', authenticate, authorize('Administrador', 'Instructor', 'Aprendiz', 'Visitante', 'Vigilante'), userIdRules, ownership({ source: 'params', field: 'id', authUserField: 'id', allowRoles: ['Administrador'] }), userCtrl.getUserVehicles);
router.put('/:id', authenticate, authorize('Administrador', 'Instructor', 'Aprendiz', 'Visitante', 'Vigilante'), userUpdateRules, ownership({ source: 'params', field: 'id', authUserField: 'id', allowRoles: ['Administrador'] }), upload.single('fotoPerfil'), userCtrl.update);
router.delete('/:id', authenticate, authorize('Administrador'), userDeleteRules, ownership({ source: 'params', field: 'id', authUserField: 'id', allowRoles: ['Administrador'] }), userCtrl.remove);

module.exports = router;
