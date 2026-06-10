const express = require('express');
const router = express.Router();
const notiCtrl = require('../controllers/notificacionController');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const ownership = require('../middlewares/ownership');
const { notificacionUserRules, notificacionReadRules } = require('../middlewares/validators');

router.get('/user/:userId', authenticate, authorize('Administrador', 'Instructor', 'Aprendiz', 'Visitante', 'Vigilante'), notificacionUserRules, ownership({ source: 'params', field: 'userId', authUserField: 'id', allowRoles: ['Administrador'] }), notiCtrl.listForUser);
router.patch('/:id/read',
  authenticate,
  authorize('Administrador', 'Instructor', 'Aprendiz', 'Visitante', 'Vigilante'),
  notificacionReadRules,
  notiCtrl.markRead
);

module.exports = router;
