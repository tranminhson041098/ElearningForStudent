const express = require('express');
const router = express.Router();
const LessonController = require('../../app/controllers/Admin/LessonController');

router.post('/delete/:id',LessonController.delete);
router.post('/edit/:id',LessonController.processEdit);
router.post('/create/:id',LessonController.processCreate);
router.get('/edit/:id',LessonController.edit)
// router.post('/create',CourseController.processCreate)
router.get('/create/:id',LessonController.create);
// router.get('',CourseController.manageCourses);


module.exports = router;