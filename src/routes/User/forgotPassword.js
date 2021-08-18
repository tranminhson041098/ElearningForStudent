const express = require('express');
const router = express.Router();
const AccountController = require('../../app/controllers/Admin/AccountController');

router.post('',AccountController.processChangePassword);
router.get('',AccountController.changeAccountPassword);

module.exports = router;