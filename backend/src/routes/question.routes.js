const express = require('express');
const router = express.Router();

const questionController = require('../controllers/question.controller');
const requireAuth = require('../middleware/requireAuth');

router.post('/create', requireAuth, questionController.create);

module.exports = router;
