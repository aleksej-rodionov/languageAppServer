const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const englishWordSchema = new Schema({
    // id
    // wordNumber: {
    //     type: String,
    //     required: true
    // },
    catname: {
        type: String,
        required: true
    },
    eng: {
        type: String,
        required: true
    },
    rus: {
        type: String,
        required: true
    }
}, { timestamps: true }); // gonna be joinTimestamp

const EnglishWord = mongoose.model('EnglishWord', englishWordSchema);
module.exports = EnglishWord;