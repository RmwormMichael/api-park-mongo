const express = require('express');
const router = express.Router();
const repCtrl = require('../controllers/reporteController');
const authenticate = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');
const { reporteCreateRules, reporteGetRules, reporteStatsRules } = require('../middlewares/validators');

router.post('/', 
  authenticate,
  authorize('Administrador', 'Vigilante'),
  reporteCreateRules,
  repCtrl.createAndGenerate
);

router.get('/', 
  authenticate,
  authorize('Administrador', 'Vigilante', 'Instructor'),
  reporteGetRules,
  repCtrl.generateOnly
);

router.get('/stats', 
  authenticate,
  authorize('Administrador', 'Vigilante'),
  reporteStatsRules,
  repCtrl.getStats
);

module.exports = router;
