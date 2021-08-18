const express = require('express');
const router = express.Router();
const AccountController = require('../../app/controllers/Admin/AccountController');

router.get('',AccountController.replyByMail);
router.post('/userReply',AccountController.processReplyByEmail);

module.exports = router;