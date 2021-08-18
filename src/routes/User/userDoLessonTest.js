const express = require('express');
const router = express.Router();
const LessonTestController = require('../../app/controllers/Teacher/LessonTestController');

//Xử lý vấn đề lưu điểm cho 2 bảng
router.post('/processScore/:id',LessonTestController.processScore)
router.get('/:id',LessonTestController.getTestForLesson);
//router.post('',CourseController.processGetAll);

module.exports = router;