const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    // userId
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    ava_url: {
        type: String
    },
    username: {
        type: String
    }
    // todo add engProgress
    // todo add catSettings
    // todo add custom Words
    // todo add custom Categories
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;