const express = require('express');
const englishWordController = require('../controllers/englishWordController');

const router = express.Router();



router.post('/', englishWordController.englishword_create);
router.get('/', englishWordController.englishword_index);
router.get('/:id', englishWordController.englishword_details);

module.exports = router;