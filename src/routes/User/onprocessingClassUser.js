const express = require('express');
const router = express.Router();
const UserController = require('../../app/controllers/User/UserController');

router.get('',UserController.getOnprocessingClass);
// router.post('',CourseController.processLogin);

module.exports = router;