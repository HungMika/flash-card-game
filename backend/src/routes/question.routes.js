const express = require('express');
const router = express.Router();

const questionController = require('../controllers/question.controller');
const requireAuth = require('../middleware/requireAuth');

router.post('/create/:subjectId', requireAuth, questionController.create);
router.get('/show/all/:subjectId', questionController.showAll);
router.post('/search/:subjectId', questionController.search);
router.patch('/update/:questionId', requireAuth, questionController.update);
router.delete('/delete/:questionId', requireAuth, questionController.delete);

module.exports = router;
