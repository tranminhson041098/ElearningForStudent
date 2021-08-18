const express = require('express');
const ClassController = require('../../app/controllers/Admin/ClassController');
const router = express.Router();
const CourseController = require('../../app/controllers/Admin/CourseController');

router.get('/fetchDataCourse/:id',ClassController.fetchDataCourse)
router.get('/search',ClassController.getAllReload)
router.post('/search',ClassController.getClassByClassName);
router.get('/category/:id',ClassController.getAllClassByCategoryId);

router.get('',CourseController.getAll);
router.post('',CourseController.processGetAll);

module.exports = router;