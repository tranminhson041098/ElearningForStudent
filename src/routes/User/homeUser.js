const express = require('express');
const router = express.Router();
const UserController = require('../../app/controllers/User/UserController');

router.get('',UserController.home);
router.post('',UserController.processHome);

module.exports = router;