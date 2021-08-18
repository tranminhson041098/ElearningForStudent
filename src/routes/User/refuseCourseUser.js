const express = require('express');
const router = express.Router();
const UserController = require('../../app/controllers/User/UserController');

router.get('',UserController.getRefusedCourse);
// router.post('',CourseController.processLogin);

module.exports = router;