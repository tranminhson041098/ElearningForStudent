const express = require('express');
const router = express.Router();
const UserController = require('../../app/controllers/User/UserController');

//router.get('/view/:id',UserController.viewNotRegisterClassDetailPage);
//Hiển thị chi tiết khóa học đã đăng kí thành công
router.get('/:id',UserController.getRegisterCourseDetailPage);


module.exports = router;