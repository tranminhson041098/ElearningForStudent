const express = require('express');
const router = express.Router();
const UserController = require('../../app/controllers/User/UserController');

router.get('',UserController.showProfile);
router.post('',UserController.processEditProfile)
// router.post('',CourseController.processLogin);

module.exports = router;