const mongoose = require('mongoose');
const passwordResetTokenSchema = new mongoose.Schema({
    accessToken: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    isValid: {
        type: Boolean,
    }
}, 
    {
        timestamps: true,
    }
);

const PasswordResetToken = mongoose.model('PasswordResetToken', passwordResetTokenSchema);

module.exports = PasswordResetToken;