const express = require('express');
const router = express.Router();
const TeacherController = require('../../app/controllers/Teacher/TeacherController');

router.get('/courseDetail/viewAllLesson',TeacherController.viewAllLessonOfCourse)
router.get('/courseDetail/:id',TeacherController.getAllStudentFromCourse);


module.exports = router;