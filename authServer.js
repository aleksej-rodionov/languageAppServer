require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const jwt = require('jsonwebtoken')

const dbURI = 'mongodb+srv://alexey:Govnohuy91@realblog.a3hilmj.mongodb.net/language-app?retryWrites=true&w=majority'

mongoose.set("strictQuery", false); // added because of 15.12.22 Warning
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => { app.listen(4000) })
    .catch((err) => { console.log(err) });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(morgan('dev'));





let refreshTokens = [] // todo DELETE and store refreshTokens in mongoDB

//=================AUTH ENDPOINTS START===================


//register
app.post('/auth/register', async (req, res) => {
    const { email, password: plainTextPassword } = req.body
    
    if (!email || typeof email !== 'string') {
		return res.json({ status: 'error', error: 'Invalid email' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 6) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    try {
        const response = await User.create({
			email,
			password: hashedPassword
		});
        console.log('User created successfully: ', response)
    } catch (err) {
        if (err.code === 11000) {
			// duplicate key
			return res.json({ status: 'error', error: 'Email already in use' })
		}
        throw err
    }

    res.json({ status: 'ok' })
});


//login
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email }).lean()

    if (!user) {
		return res.json({ status: 'error', error: 'Invalid email/password (user == null)' });
	}

    if (await bcrypt.compare(password, user.password)) {
 
        const token = generateAccessToken(user);
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
        refreshTokens.push(refreshToken); // todo DELETE and store refreshToken in mongoDB

        return res.json({ status: 'ok', accessToken: token, refreshToken: refreshToken });
	}

	res.json({ status: 'error', error: 'Invalid email/password (passwords are not the same)' });
});


//refresh-token
app.post('/auth/refresh-token', async (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    /**
     * todo DELETE below and use mongoDB to store refreshTokens
     */
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ email: user.email });
        res.json({ accessToken: accessToken });
    })
});


//change-password
app.post('/auth/change-password', async (req, res) => {
    // todo
});


//logout
app.delete('/auth/logout', (req, res) => {
    refreshTokens = refreshTokens.filter(token =>token !== req.body.token);
    res.sendStatus(204);
});



//=================AUTH ENDPOINTS END===================

app.use((req, res) => {
    res.status(404).json({ error: 'Nothing found' })
});



//===========================FUNCTIONS============================
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
}