const express = require('express');
const router = express.Router();
const notiCtrl = require('../controllers/notificacionController');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const ownership = require('../middlewares/ownership');

router.get('/user/:userId', authenticate, authorize('Administrador', 'Instructor', 'Aprendiz', 'Visitante', 'Vigilante'), ownership({ source: 'params', field: 'userId', authUserField: 'id', allowRoles: ['Administrador'] }), notiCtrl.listForUser);
router.patch('/:id/read',
  authenticate,
  authorize('Administrador', 'Instructor', 'Aprendiz', 'Visitante', 'Vigilante'),
  notiCtrl.markRead
);

module.exports = router;
