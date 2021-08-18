const express = require('express');
const router = express.Router();
const DocumentController = require('../../app/controllers/Teacher/DocumentController');

router.post('/create/:id',DocumentController.processCreate)
router.get('/detail/:id',DocumentController.viewDetail)
router.post('/delete/:id',DocumentController.processDelete);
router.post('/edit/:id',DocumentController.processEdit)
router.get('/:id',DocumentController.view);
//router.post('',TeacherController.processHome);

module.exports = router;