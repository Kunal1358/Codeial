const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function(req, res){
    Post.findById(req.body.post, function(err, post){

        if (post){
            Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            }, function(err, comment){
                if(err){cosole.log("Error while creating comment \n", err); return;}

                post.comments.push(comment);
                post.save();

                res.redirect('/');
            });
        }

    });
}

module.exports.destroy = function(req,res){

    Comment.findById(req.params.id, function(err,comment){

        if(err){console.log("Error in finding Comment in DB \n", err); return;}

        if(comment.user == req.user.id){

            comment.remove();
            
            let postId = comment.post;

            Post.findByIdAndUpdate(postId , { $pull : {comments : req.params.id }}, function(err,post){
                if(err){console.log("Error in Updating Comments in Post \n", err); return;}
    
                return res.redirect('back');
            })
        }else{
            return res.redirect('back');
        }  
    })
}

