const express = require('express');
const router = express.Router();
const TeacherController = require('../../app/controllers/Teacher/TeacherController');

router.get('/:id',TeacherController.viewDetailResultLessonExam);
router.get('/viewFalseQuestion/:id',TeacherController.viewFalseQuestionByTeacher);

module.exports = router;