const express = require('express');
const router = express.Router();

const subjectController = require('../controllers/subject.controller');
const requireAuth = require('../middleware/requireAuth');

router.post('/create', requireAuth, subjectController.create);
router.get('/show/all', subjectController.showAll);
router.get('/show/:group', subjectController.showByGroup);
router.get('/show/my/:group', requireAuth, subjectController.show);
router.post('/search', subjectController.search);
router.patch('/update/:subjectId', requireAuth, subjectController.update);
router.delete('/delete/:subjectId', requireAuth, subjectController.delete);

module.exports = router;
