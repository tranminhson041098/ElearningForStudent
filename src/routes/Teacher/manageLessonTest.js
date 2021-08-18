const express = require('express');
const router = express.Router();
const LessonTestController = require('../../app/controllers/Teacher/LessonTestController');

router.get('/view/:id',LessonTestController.viewDetail);
router.get('/:id',LessonTestController.getAllTest);
router.post('/create/:id',LessonTestController.processCreate);
router.post('/edit/:id',LessonTestController.processEdit);
router.post('/delete/:id',LessonTestController.processDeleteTest);
//router.post('',TeacherController.processHome);

//router.post('/changeStatus/notavailble',LessonTestController.changeStatusNotAvailble)
router.post('/changeStatus/:id',LessonTestController.changeStatus)

module.exports = router;