const express = require('express');
const router = express.Router();
const AdminController = require('../../app/controllers/Admin/AdminController');

router.get('',AdminController.manageNotifications);


module.exports = router;