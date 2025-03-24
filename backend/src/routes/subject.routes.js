const express = require('express');
const router = express.Router();

const subjectController = require('../controllers/subject.controller');
const requireAuth = require('../middleware/requireAuth');

router.post('/create', requireAuth, subjectController.create);

module.exports = router;
