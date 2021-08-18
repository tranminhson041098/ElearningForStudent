const express = require('express');
const router = express.Router();
const AdminController = require('../../app/controllers/Admin/AdminController');
const ClassController = require('../../app/controllers/Admin/ClassController');

router.post('/confirm/:id',ClassController.confirmRequestToClass)
router.post('/delete/:id',ClassController.deleteRequestToClass)
router.get('',AdminController.manageNewregister);


module.exports = router;