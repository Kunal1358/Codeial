const mongoose = require('mongoose');

console.log("Inside notification Model \n");

const notificationSchema = new mongoose.Schema({

    from_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    to_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    },
    contentId: {
        type: mongoose.ObjectId
    },
    type: {
        type: String

    },
    isRead: {
        type: Boolean
    }

},{
    timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;