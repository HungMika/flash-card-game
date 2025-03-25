const express = require('express');
const router = express.Router();

const subjectController = require('../controllers/subject.controller');
const requireAuth = require('../middleware/requireAuth');

router.post('/create', requireAuth, subjectController.create);
router.get('/show/all', subjectController.showAll);
router.get('/show/:group', subjectController.showByGroup);

module.exports = router;
