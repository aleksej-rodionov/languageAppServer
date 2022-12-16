const express = require('express');
const englishCategoryController = require('../controllers/englishCategoryController');

const router = express.Router();



router.post('/', englishCategoryController.englishcategory_create);
router.put('/:id', englishCategoryController.englishcategory_update);
router.delete('/:id', englishCategoryController.englishcategory_delete);
router.get('/', englishCategoryController.englishcategory_index);
router.get('/:id', englishCategoryController.englishcategory_details);

module.exports = router;