const express = require('express');
const router = express.Router();
const AdminController = require('../../app/controllers/Admin/AdminController');

router.post('/create',AdminController.processCreateTeacherAccount);
router.get('/create',AdminController.createTeacherAccount);
router.get('',AdminController.manageTeachersAccount);


module.exports = router;