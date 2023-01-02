require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
const englishWordRoutes = require('./routes/englishWordRoutes');
const englishCategoryRoutes = require('./routes/englishCategoryRoutes');

const app = express();

const bodyParser = require('body-parser');


// dbUri
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

// routes THEN USE THESE ROUTEs INSTEAD OF CALLING DB FROM THIS FILE!!!
app.use('/users', userRoutes);
app.use('/notes', noteRoutes);
app.use('/englishwords', englishWordRoutes);
app.use('/englishcategories', englishCategoryRoutes);


app.use((req, res) => {
    res.status(404).json({ error: 'Nothing found' })
});



