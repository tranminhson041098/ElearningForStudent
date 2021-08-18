const express = require('express');
const router = express.Router();
const CategoryController = require('../../app/controllers/Admin/CategoryController');


router.get('/edit/:id',CategoryController.editCategory);
router.post('/edit/:id',CategoryController.updateCategory);
router.post('/create',CategoryController.processCreate)
router.get('/create',CategoryController.create)
router.get('',CategoryController.index);



module.exports = router;