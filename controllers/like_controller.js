const Like = require('../models/like');
const Post = require('../models/post');
const Comment = require('../models/comment');
const queue = require('../config/kue');

const likeMailer = require('../mailers/likes_mailer');
const likeEmailWorker = require('../worker/like_email_worker');


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