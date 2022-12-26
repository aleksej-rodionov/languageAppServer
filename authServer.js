require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const User = require('./models/user');
const RefreshTokenModel = require('./models/refreshToken')

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





// let refreshTokens = [] // todo DELETE and store refreshTokens in mongoDB

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

    const user = new User({ email: email, password: plainTextPassword });

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

    res.json({ status: 'ok', body: user })
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

        /**
         * todo DELETE below and store refreshToken in mongoDB
         */
        // refreshTokens.push(refreshToken);
        const refreshTokenEntity = new RefreshTokenModel({ token: refreshToken, user: user });
        refreshTokenEntity.save()
            .then((result) => {
                console.log("REFRESH_TOKEN STORED IN mongoDB:\n" + result);
            })
            .catch((err) => {
                console.log("ERROR STORING REFRESH_TOKEN:\n" + err);
            });
        //====================================================================================

        return res.json({ status: 'ok', body: { accessToken: token, accessTokenExp: 15, refreshToken: refreshToken }});
	}

	res.json({ status: 'error', error: 'Invalid email/password (incorrect password)' });
});


//refresh-token
app.post('/auth/refresh/:refreshtoken', async (req, res) => {
    const refreshToken = req.params.refreshtoken;
    if (refreshToken == null) return res.sendStatus(401);

    
    if (!RefreshTokenModel.find({ token: refreshToken })) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        console.log("refreshToken = " + refreshToken);

        // if (err) return res.sendStatus(403);
        if (err) {
            // return res.status(403).json({ status: 'error', error: err.message })
            return res.json({ status: 'error', error: err.message })
        }

        const accessToken = generateAccessToken({ email: user.email });

        //=================================REFRESH REFRESHTOKEN WHEN REFRESH TOKEN===================================================
        // const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
        // const refreshTokenEntity = new RefreshTokenModel({ token: refreshToken, user: user });
        // refreshTokenEntity.save()
        //     .then((result) => {
        //         console.log("REFRESH_TOKEN STORED IN mongoDB:\n" + result);
        //     })
        //     .catch((err) => {
        //         console.log("ERROR STORING REFRESH_TOKEN:\n" + err);
        //     });
        //=================================REFRESH REFRESHTOKEN WHEN REFRESH TOKEN===================================================

        // res.json({ accessToken: accessToken });
        // return res.json({ status: 'ok', body: accessToken });
        // return res.json({ status: 'ok', body: { accessToken: accessToken, accessTokenExp: 15, refreshToken: refreshToken }});
        return res.json({ status: 'ok', body: { accessToken: accessToken, accessTokenExp: 15, refreshToken: null }});

    });
    //====================================================================================

});


//change-password
app.post('/auth/change-password', async (req, res) => {
    // todo
});


//logout
app.delete('/auth/logout', (req, res) => {

    /**
     * todo DELETE below and use mongoDB to store refreshTokens
     */
    // refreshTokens = refreshTokens.filter(token =>token !== req.body.token);
    // res.sendStatus(204);
    RefreshTokenModel.findOneAndDelete({ token: req.body.token })
        .then((result) => {
            console.log("REFRESH_TOKEN SUCCESSFULLY DELETED:\n" + result);
            if (!result) {
                res.json({ status: "ok", body: "User hasn't been logged in" });
            } else {
                res.json({ status: "ok", body: "Successfully logged out" });
            }
            
        })
        .catch((err) => {
            console.log("ERROR DELETING REFRESH_TOKEN:\n" + err);
            res.json({ status: "error", error: err });
        });
    //====================================================================================

});



//=================AUTH ENDPOINTS END===================

app.use((req, res) => {
    res.status(404).json({ error: 'Nothing found' })
});



//===========================FUNCTIONS============================
function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
}