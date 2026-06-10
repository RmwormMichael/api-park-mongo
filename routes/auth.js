const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const { registerRules, loginRules } = require('../middlewares/validators');

router.post('/register', registerRules, authCtrl.register);
router.post('/login', loginRules, authCtrl.login);

module.exports = router;
