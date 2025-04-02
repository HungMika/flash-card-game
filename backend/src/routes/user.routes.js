const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const requireAuth = require('../middleware/requireAuth');

router.get('/show/all', requireAuth, userController.getAllUsers); // api test (no use in fe)
router.get('/profile', requireAuth, userController.profile);

module.exports = router;
