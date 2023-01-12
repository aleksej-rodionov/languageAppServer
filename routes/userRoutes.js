const express = require('express');
const userController = require('../controllers/userController');
const jwt = require('jsonwebtoken')

const router = express.Router();



router.get('/', userController.user_index);
// router.get('/:id', userController.user_details);
router.get('/testtext/:id', authenticateToken, userController.user_testtext);
// router.put('/:id', userController.user_update);
router.delete('/:id', userController.user_delete);

router.get('/current', authenticateToken, userController.user_current);
router.put('/change-password', authenticateToken, userController.change_password);
router.put('/change-ava', authenticateToken, userController.change_ava);

router.post('/add-field', userController.add_field);

module.exports = router;



//=========================FUNCTIONS============================

/**
 * this function below we have to use as a middleware in those requests
 * related to handling particular-user-relate data in DB
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // cause the Heated looks like "Bearer <TOKEN>"
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(401).send({ status: 'error', error: err.message })
        }
        req.user = user
        next() // we move on from this middleware
    })
}