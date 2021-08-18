const express = require('express');
const router = express.Router();
const UserController = require('../../app/controllers/User/UserController');

router.get('/view/:id',UserController.viewNotRegisterClassDetailPage);
//Khi đã login
router.get('/:id',UserController.getNotRegisterCourseDetailPage);


module.exports = router;