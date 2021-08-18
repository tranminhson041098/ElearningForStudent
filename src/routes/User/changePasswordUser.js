const express = require('express');
const router = express.Router();
const UserController = require('../../app/controllers/User/UserController');

router.get('',UserController.userChangePassword);
router.post('',UserController.processUserChangePassword);

module.exports = router;