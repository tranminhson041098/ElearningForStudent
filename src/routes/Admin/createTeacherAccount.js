const express = require('express');
const router = express.Router();
const AccountController = require('../../app/controllers/Admin/AccountController');

router.get('',AccountController.createTeacherAccount);


module.exports = router;