const express = require('express');
const router = express.Router();
const ClassController = require('../../app/controllers/Admin/ClassController');

router.get('/loginCourse/lessonDetail/viewFalseQuestion/:id',ClassController.viewFalseQuestion);
router.get('/loginCourse/lessonDetail/:id',ClassController.viewDetailHistoryLesson);
router.get('/loginCourse/:id',ClassController.viewOverallHistory);

module.exports = router;