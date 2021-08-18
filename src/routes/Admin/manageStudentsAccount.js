const express = require('express');
const router = express.Router();
const AdminController = require('../../app/controllers/Admin/AdminController');

router.post('/unblock/:id',AdminController.processUnblockStudent)
router.post('/block/:id',AdminController.processBlockStudent);
router.get('/block',AdminController.manageStudentBlockAccount)
router.get('',AdminController.manageStudentsAccount);


module.exports = router;