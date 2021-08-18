const express = require('express');
const router = express.Router();
const DocumentController = require('../../app/controllers/Teacher/DocumentController');

router.get('',DocumentController.viewDocumentAdmin)
//router.post('',TeacherController.processHome);

module.exports = router;