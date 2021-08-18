const express = require('express');
const router = express.Router();
const ClassController = require('../../app/controllers/Admin/ClassController');


router.post('/delete/:id',ClassController.processDelete)
router.post('/edit/:id',ClassController.processEdit);
router.post('/create/:id',ClassController.processCreate);
router.get('/edit/:id',ClassController.edit)
// router.post('/create',CourseController.processCreate)
router.get('/create/:id',ClassController.create);
// router.get('',CourseController.manageCourses);


module.exports = router;