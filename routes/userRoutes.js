const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();



router.post('/register', userController.user_create);
router.post('/login', userController.user_login);
router.put('/:id', userController.user_update);
router.delete('/:id', userController.user_delete);
router.get('/', userController.user_index);
router.get('/:id', userController.user_details);

module.exports = router;