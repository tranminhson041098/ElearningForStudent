const express = require('express');
const router = express.Router();
const UserController = require('../../app/controllers/User/UserController');

router.post('',UserController.processChangePassword);
router.get('',UserController.changePassword);


module.exports = router;