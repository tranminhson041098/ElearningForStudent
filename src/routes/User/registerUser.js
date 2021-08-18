const express = require('express');
const router = express.Router();
const UserController = require('../../app/controllers/User/UserController');

router.get('',UserController.register);
router.post('',UserController.processRegister);

module.exports = router;