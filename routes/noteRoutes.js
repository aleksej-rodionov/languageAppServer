const express = require('express');
const noteController = require('../controllers/noteController');
const jwt = require('jsonwebtoken')

const router = express.Router();



router.post('/', noteController.note_create);
router.get('/', noteController.note_index);
router.get('/:email', authenticateToken, noteController.note_index_by_email);

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
        if (err) return res.sendStatus(403);
        req.user = user
        next() // we move on from this middleware
    })
}