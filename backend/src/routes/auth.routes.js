const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const verifyToken = require('../middleware/requireAuth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', verifyToken, authController.logout);

module.exports = router;
