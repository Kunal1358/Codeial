const Post = require('../models/post');
const Comments = require('../models/comment');
const Like = require('../models/like');
const queue = require('../config/kue');

const postMailer  = require('../mailers/posts_mailer');
const postEmailWorker = require('../worker/post_email_worker');


module.exports.create = async function(req, res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

                    
        // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
        post = await post.populate('user', 'name')

        // Create Post Email
        let job = queue.create('newPost', post).save(function(err){
            if(err){console.log("Error in creating a queue \n", err); return; }

            console.log("Job enqued ", job.id);
        })

        if (req.xhr){

            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            });
        }

        req.flash('success', 'Post published!');
        return res.redirect('back');

    }catch(err){
        req.flash('error', err);
        console.log(err);
    }
  
}

// Delete Post
module.exports.destroy = async function(req,res){

    try{

        let post = await Post.findById(req.params.id);

        if(post.user == req.user.id){
            post.remove();

            await Comments.deleteMany({post: req.params.id});

            if (req.xhr){

            //  delete the associated likes for the post and all its comments' likes too
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});

            // Delete Post Email
            let job = queue.create('deletePost', post).save(function(err){
                if(err){console.log("Error in creating a queue \n", err); return; }
                console.log("Job enqued ", job.id);
            })

                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }
            
            req.flash('success', 'Post and associated comments deleted!');
            return res.redirect('back');
        
        }else{
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error', err);
        console.error("Eror deleting post",err);
        return;
    }

}