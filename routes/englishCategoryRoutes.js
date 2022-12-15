const express = require('express');
const englishCategoryController = require('../controllers/englishCategoryController');

const router = express.Router();



router.post('/', englishCategoryController.englishcategory_create);

module.exports = router;