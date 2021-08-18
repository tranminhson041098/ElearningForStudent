const express = require('express');
const router = express.Router();
const ClassController = require('../../app/controllers/Admin/ClassController');


router.get('/view/:id',ClassController.getAllInfoClassTeacher);
//router.post('',TeacherController.processHome);

module.exports = router;