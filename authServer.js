const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();

const dbURI = 'mongodb+srv://alexey:Govnohuy91@realblog.a3hilmj.mongodb.net/language-app?retryWrites=true&w=majority'

mongoose.set("strictQuery", false); // added because of 15.12.22 Warning
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => { app.listen(3000) })
    .catch((err) => { console.log(err) });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(morgan('dev'));

//=================AUTH ENDPOINTS START===================


//register
app.post('/users/register', async (req, res) => {
    console.log(req.body);

    const { username, password: plainTextPassword } = req.body

    if (!username || typeof username !== 'string') {
		return res.json({ status: 'error', error: 'Invalid username' })
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
        const user = await new User({
            username: req.body.username,
            password: hashedPassword
        });
        User.create(user)
            .then((result) => {
                res.send(result)
            })
            .catch((err) => {
                console.log(err)
            });
            console.log('User created successfully: ', user);
    } catch (err) {
        console.log('catch block fired')
        if (err.code === 11000) {
			// duplicate key
			return res.json({ status: 'error', error: 'Username already in use' })
		}
        // res.status(500).send()
        throw err
    }
    
    res.json({ status: 'ok' })
});


//login
app.post('/users/login', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username }).lean()

    if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}

    if (await bcrypt.compare(password, user.password)) {
 
        const token = "sdelaj jobanyj token" // todo jwt shit

        return res.json({ status: 'ok', data: token })
	}

	res.json({ status: 'error', error: 'Invalid username/password' })
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