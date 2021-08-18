const express = require('express');
const router = express.Router();
const TeacherController = require('../../app/controllers/Teacher/TeacherController');

router.get('',TeacherController.index);
router.post('',TeacherController.processLogin);

module.exports = router;