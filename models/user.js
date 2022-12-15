const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    // userId
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
    // todo add engProgress
    // todo add custom Words
    // todo add custom Categories
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;