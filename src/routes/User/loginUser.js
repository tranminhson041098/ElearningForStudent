const express = require('express');
const router = express.Router();
const UserController = require('../../app/controllers/User/UserController');

router.get('',UserController.index);
router.post('',UserController.processLogin);

module.exports = router;