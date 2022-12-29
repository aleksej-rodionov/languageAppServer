const express = require('express');
const noteController = require('../controllers/noteController');
const jwt = require('jsonwebtoken')

const router = express.Router();



router.post('/', noteController.note_create);
router.get('/', authenticateToken, noteController.note_index_by_user);
router.get('/:noteid', authenticateToken, noteController.note_by_id); // todo use const request = require('request');
router.put('/:noteId', authenticateToken, noteController.note_update); // todo use queries also
router.delete('/:noteId', authenticateToken, noteController.note_delete); // todo same thing

module.exports = router;



//=========================FUNCTIONS============================

/**
 * this function below we have to use as a middleware in those requests
 * related to handling particular-user-related data in DB
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // cause the Header looks like "Bearer <TOKEN>"
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            // return res.status(403).json({ status: 'error', error: err.message })
            return res.status(401).send({ status: 'error', error: err.message })
        }
        req.user = user
        next() // we move on from this middleware
    })
}