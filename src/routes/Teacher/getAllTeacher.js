const express = require('express');
const router = express.Router();
const ClassController = require('../../app/controllers/Admin/ClassController');
const AccountController = require('../../app/controllers/Admin/AccountController');

router.get('/viewCourse/:id',ClassController.getAllCourseByTeacherForUser)
router.get('',AccountController.getAllTeacher);


module.exports = router;