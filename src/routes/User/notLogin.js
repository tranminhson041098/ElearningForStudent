const express = require('express');
const router = express.Router();
const UserController = require('../../app/controllers/User/UserController');

router.get('/not-register-coursedetail/:id',UserController.viewNotLoginRegisterClassDetailPage);

module.exports = router;