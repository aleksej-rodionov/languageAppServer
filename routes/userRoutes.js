const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();



router.post('/', userController.user_create);
router.post('/login', userController.user_login);
router.delete('/:id', userController.user_delete);

module.exports = router;