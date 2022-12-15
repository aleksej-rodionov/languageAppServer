const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

// todo THEN REMOVETHESE AND USE ROUTES INSTEAD!!!
const User = require('./models/user');
const EnglishWord = require('./models/englishWord');
const EnglishCategory = require('./models/englishCategory');

const app = express();

const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');


// dbUri
const dbURI = 'mongodb+srv://alexey:Govnohuy91@realblog.a3hilmj.mongodb.net/language-app?retryWrites=true&w=majority'

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => { app.listen(3000) })
    .catch((err) => { console.log(err) });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(morgan('dev'));

// routes THEN USE THESE ROUTEs INSTEAD OF CALLING DB FROM THIS FILE!!!
// app.use('/users', userRoutes);
// app.use('/english-words', englishWordRoutes);
// app.use('/english-categories', englishCategoryRoutes);



// DIFFERENT TYPES OF REQUESTS (SANDBOX)==================================







// DIFFERENT TYPES OF REQUESTS (SANDBOX) - END==================================



app.use((req, res) => {
    res.status(404).json({ error: 'Nothing found' })
});