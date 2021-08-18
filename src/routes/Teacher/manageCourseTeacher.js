const express = require('express');
const router = express.Router();
const ClassController = require('../../app/controllers/Admin/ClassController');


router.get('',ClassController.getAllCourseByTeacher);
//router.post('',TeacherController.processHome);

module.exports = router;