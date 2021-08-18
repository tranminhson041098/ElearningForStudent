const express = require('express');
const router = express.Router();
const CourseController = require('../../app/controllers/Admin/CourseController');
const ClassController = require('../../app/controllers/Admin/ClassController');

router.post('/unblockStudentToCourse/:id',ClassController.unblockStudentToCourse)
router.post('/blockStudentToCourse/:id',ClassController.blockStudentToCourse);
router.post('/addStudentToCourse/:id',ClassController.processAddStudentsToCourse);
router.get('/addStudentToCourse/:id',ClassController.addStudentsToCourse)
router.get('/viewStudentBlockInCourse/:id',ClassController.viewStudentBlockInCourse);
router.get('/viewStudentActiveInCourse/:id',ClassController.viewStudentActiveInCourse);
router.post('/edit/:id',CourseController.processEditCourse);
router.get('/edit/:id',CourseController.edit)
router.post('/create',CourseController.processCreate)
router.get('/create',CourseController.create);
router.get('',CourseController.manageCourses);
//Chức năng disable sẽ tương tự chức năng delete trong khóa học
router.delete('/disable/:id',CourseController.disableCourse);

module.exports = router;