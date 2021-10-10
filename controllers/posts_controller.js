
const Post = require('../models/Post');

module.exports.create = function(req,res){

    Post.create({
        content: req.body.content,
        user: req.user_id
    },function(error,post){
        if(error){console.log("Error creating post"); return;}

        return res.redirect('back');
    });

}