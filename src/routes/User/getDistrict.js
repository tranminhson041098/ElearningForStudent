const express = require('express');
const router = express.Router();
const UserController = require('../../app/controllers/User/UserController');

router.post('/:id',UserController.getDistrict);

module.exports = router;