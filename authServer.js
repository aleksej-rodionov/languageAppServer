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

//=================AUTH ENDPOINTS START===================


//register
app.post('/users/register', async (req, res) => {
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
app.post('/users/login', async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email }).lean()

    if (!user) {
		return res.json({ status: 'error', error: 'Invalid email/password (user == null)' });
	}

    if (await bcrypt.compare(password, user.password)) {
 
        const token = generateAccessToken({
				id: user._id,
				username: user.username
			});
        return res.json({ status: 'ok', data: token });
	}

	res.json({ status: 'error', error: 'Invalid email/password (passwords are not the same)' });
});


//change-password
app.post('/users/change-password', async (req, res) => {
    // todo
});


//token?
app.post('/users/token', async (req, res) => {
    // todo
});


//logout
app.delete('/users/logout', (req, res) => {
    // todo
});



//=================AUTH ENDPOINTS END===================

app.use((req, res) => {
    res.status(404).json({ error: 'Nothing found' })
});



//===========================FUNCTIONS============================
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
}