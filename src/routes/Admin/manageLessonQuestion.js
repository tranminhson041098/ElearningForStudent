const express = require('express');
const router = express.Router();
const LessonQuestionController = require('../../app/controllers/Admin/LessonQuestionController');

router.post('/delete/:id',LessonQuestionController.processDelete)
router.get('/detailQuestion/:id',LessonQuestionController.getDetailQuestion)
router.post('/create/:id',LessonQuestionController.create);
router.post('/edit/:id',LessonQuestionController.processEdit);
router.get('/:id',LessonQuestionController.index)

module.exports = router;