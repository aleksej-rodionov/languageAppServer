const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema({
    // id
    token: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

const RefreshTokenModel = mongoose.model('RefreshTokenModel', refreshTokenSchema);
module.exports = RefreshTokenModel;