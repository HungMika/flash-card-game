const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');
const verifyToken = require('../middleware/requireAuth');

router.get('/show/all', verifyToken, userController.getAllUsers);

module.exports = router;
