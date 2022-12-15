const express = require('express');
const englishCategoryController = require('../controllers/englishCategoryController');

const router = express.Router();



router.post('/', englishCategoryController.english_category_create);

module.exports = router;