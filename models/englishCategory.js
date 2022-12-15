const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const englishCategorySchema = new Schema({
    // id
    // categoryNumber: {
    //     type: String,
    //     required: true
    // },
    catname: {
        type: String,
        required: true
    }
}, { timestamps: true }); // gonna be joinTimestamp

const EnglishCategory = mongoose.model('EnglishCategory', englishCategorySchema);
module.exports = EnglishCategory;