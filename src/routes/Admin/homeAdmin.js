const express = require('express');
const router = express.Router();
const AdminController = require('../../app/controllers/Admin/AdminController');

router.get('',AdminController.home);
router.post('',AdminController.processHome);

module.exports = router;