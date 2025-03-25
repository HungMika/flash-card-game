const express = require('express');
const router = express.Router();

const questionController = require('../controllers/question.controller');
const requireAuth = require('../middleware/requireAuth');

router.post('/create/:subjectId', requireAuth, questionController.create);
router.get('/show/all/:subjectId', questionController.showAll);

module.exports = router;
