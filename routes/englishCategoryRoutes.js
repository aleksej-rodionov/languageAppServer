const express = require('express');
const englishCategoryController = require('../controllers/englishCategoryController');

const router = express.Router();



router.post('/', englishCategoryController.englishcategory_create);
router.put('/', englishCategoryController.englishcategory_update);
router.delete('/', englishCategoryController.englishcategory_delete);
router.get('/', englishCategoryController.englishcategory_index);
router.get('/:id', englishCategoryController.englishcategory_details);

module.exports = router;