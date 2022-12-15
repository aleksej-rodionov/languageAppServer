const express = require('express');
const englishWordController = require('../controllers/englishWordController');

const router = express.Router();



router.post('/', englishWordController.englishword_create);

module.exports = router;