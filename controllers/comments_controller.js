const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/users');
const Like = require('../models/like');
const Notification = require('../models/notification');

const commentMailer = require('../mailers/comments_mailer');
const commentEmailWorker = require('../worker/comment_email_worker');

const queue = require('../config/kue');
const mongoose= require('mongoose');


module.exports.create = async function(req, res){

    try{
        let post = await Post.findById(req.body.post);

        if (post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            post.save();

            // populate User
            comment = await comment.populate('user', 'name email');


            // Web Notifications
// **********************************************************************************************************************            

            let commentedPost = await Post.findById(req.body.post);
            let commentedPostUser = commentedPost.user;

            let s =""+(commentedPostUser);
            var fetchedUser = s.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "");

            console.log("Fetched Id ->",fetchedUser);// Post User ID

            let fetchedUserModel = await User.findById(fetchedUser);
            console.log(fetchedUserModel.name)

            let content;
            if(req.user.id == fetchedUserModel.id){
                 content = "You have successfully commented your post"
            }else{
                 content = req.user.name +" "+ "Commented On Your Post";
            }

            // Main 
            let newNotification = await Notification.create({
                from_user: req.user.id, // Profile User
                to_user:fetchedUser, // Post/comment  id
                type: 'New Comment',
                isRead: false,
                content: content,
                contentId: req.body.post
              });        

              fetchedUserModel.notifications.push(newNotification);
              fetchedUserModel.save();


// **********************************************************************************************************************            


            // Email Job
            let job = queue.create('newComment', comment).save(function(err){
                if(err){console.log("Error in creating a queue \n", err); return; }

                console.log("Job enqued ", job.id);
            })

            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Post created!"
                });
            }


            req.flash('success', 'Comment published!');

            res.redirect('back');
        }
    }catch(err){
        req.flash('error', err);
        return;
    }
    
}


module.exports.destroy = async function(req,res){

    try{

        let comment = await Comment.findById(req.params.id);
        
        if(comment.user == req.user.id){

            let postId = comment.post;

            comment.remove();
            let post = await Post.findByIdAndUpdate(postId , { $pull : {comments : req.params.id }});

             // destroy the associated likes for this comment
             await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

             let job = queue.create('deleteComment', comment).save(function(err){
                if(err){console.log("Error in creating a queue \n", err); return; }

                console.log("Job enqued ", job.id);
            })


            // send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

            req.flash('success', 'Comment deleted!');
            return res.redirect('back');  
             
        }else{
            req.flash('error', 'Unauthorized');
            return res.redirect('back');
        }  

    }catch(err){
        req.flash('error', err);
        console.error("Eror deleting post",err);
        return;
    }   

}

