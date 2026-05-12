const express = require('express');
const router = express.Router();
const { login, logout, refresh, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateLogin } = require('../middleware/validate');

router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
