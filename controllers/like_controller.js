const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');
const queue = require('../config/kue');
const User = require('../models/users');

const likeMailer = require('../mailers/likes_mailer');
const likeEmailWorker = require('../worker/like_email_worker');

const Notification = require('../models/notification');
const mongoose= require('mongoose');

module.exports.toggleLike = async function(req, res){
    try{

        // likes/toggle/?id=abcdef&type=Post
        let likeable;
        let deleted = false;


        if (req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }


        // check if a like already exists
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        })

        // if a like already exists then delete it
        if (existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();

            existingLike.remove();
            deleted = true;

        }else{
            // else make a new like

            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });

            likeable.likes.push(newLike._id);
            likeable.save();

            // **********************************************************************************************************************
            // Web Notifications

            const ObjectId = mongoose.Types.ObjectId;
            let notificationUser = await User.findOne({_id: ObjectId(req.user.id)});
            console.log("notificationUser\n", notificationUser.id);

            
            const TypeofContent = req.query.type;
            const userName = req.user.name;
            let content;

            let post_comment_User;
            if(req.query.type == 'Post'){
                 post_comment_User = await Post.findOne({_id: ObjectId(req.query.id)});
            }else{
                 post_comment_User = await Comment.findOne({_id: ObjectId(req.query.id)});
            }


            let s =""+(post_comment_User.user);
                var fetchedUser_pc = s.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "");

            // console.log("fetchedUser_pc",fetchedUser_pc);

            // console.log("Printing\n",post_comment_User.user);

            const notificationUser_pc = ""+notificationUser.id;

            if(notificationUser_pc == fetchedUser_pc){

                content= "You have successfully Liked Your "+ TypeofContent;

            }else{
                content= userName + " Liked Your "+ TypeofContent;
            }
  
            try{

                let newNotification = await Notification.create({
                  from_user: req.user.id, // Profile User
                  to_user:post_comment_User.user, // Post/comment  id
                  type: req.query.type+ " Liked",
                  isRead: false,
                  content: content,
                  contentId: req.query.id
                });        

                // console.log(newNotification);

                // Adding Notification to Users 

                // let usersPost = await Post.findOne({_id: ObjectId(req.query.id)});
                let usersPost;


                if(req.query.type == 'Post'){
                     usersPost = await Post.findById(req.query.id);
               }else{
                    usersPost = await Comment.findById(req.query.id);
               }

                let s =""+(usersPost.user);
                var fetchedUser = s.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "");

                console.log("Fetched",fetchedUser);

                let fetchedUserModel = await User.findOne({_id: ObjectId(fetchedUser)});

                fetchedUserModel.notifications.push(newNotification);
                fetchedUserModel.save();

            
                // req.flash('success', 'Notification Added!');           
                
              }catch(err){
                req.flash('error', "Internal Server Error");
                console.log(err);
            }

            console.log("finish")

// **********************************************************************************************************************            


            // Email notification
            // If user like the post then send email post liked
            if(req.query.type == 'Post'){

                let job = queue.create('postLike', newLike._id).save(function(err){
                    if(err){console.log("Error in creating a queue \n", err); return; }
        
                    console.log("Job enqued ", job.id);
                });
            }else{ // else end mail comment liked

                let job = queue.create('commentLike', newLike._id).save(function(err){
                    if(err){console.log("Error in creating a queue \n", err); return; }
        
                    console.log("Job enqued ", job.id);
                });

            }

        }

        return res.json(200, {
            message: "Request successful!",
            data: {
                deleted: deleted
            }
        })



    }catch(err){
        console.log(err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}