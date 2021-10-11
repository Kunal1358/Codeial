const Post = require('../models/post');
const Comments = require('../models/comment');

module.exports.create = function(req,res){

    Post.create({
        content: req.body.content,
        user: req.user._id
    },function(error,post){
        if(error){console.log("Error creating post"); return;}

        return res.redirect('back');
    });
}


module.exports.destroy = function(req,res){

    Post.findById(req.params.id , function(err,post){

        if(post.user == req.user.id){
            
            post.remove();

            Comments.deleteMany({post: req.params.id},function(error){
                if(error){console.error("Error deleting post from DB \n" , error); return;}
                return res.redirect('back');
            })
        }else{
            return res.redirect('back');
        }

    });

}