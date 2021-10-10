const mongoose = require('mongoose');


const postSchema = mongoose.Schema({
    content:{
        type: String,
        required :  true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, // type is user 
        ref: 'User'
    }
},{
    timestamps: true
});

const post = mongoose.model('Post',postSchema);

module.exports = post;