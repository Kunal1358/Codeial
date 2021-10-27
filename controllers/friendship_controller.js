const User = require('../models/users');
const Friendship = require('../models/friendship');

const Post = require('../models/post');

const mongoose= require('mongoose');

const queue = require('../config/kue');

const likeMailer = require('../mailers/likes_mailer');
const likeEmailWorker = require('../worker/like_email_worker');



module.exports.createFriendshipTest = async function(req, res){

    const ObjectId = mongoose.Types.ObjectId;

    try{

        let user = await User.findById(req.user.id); // to do id same as from_user
        let user_to_user = await User.findById(req.params.id); // to do id same as from_user

    let friendAlredy = false;

    let f2= await Friendship.findOne({ from_user:ObjectId(req.user.id) , to_user:ObjectId(req.params.id)});

    if(f2==null){
        
        let new_friendship = await Friendship.create({
            from_user: req.user.id, // logged in user
            to_user: req.params.id // profile user
        });

        user.friendships.push(new_friendship); // adding in user Model friend Array
        user_to_user.friendships.push(new_friendship);// added to user 
        
        user.save();
        user_to_user.save();
       
        if (req.xhr){
            return res.status(200).json({
                data: {
                    friendship: friendship
                },
                message: "friendship created!"
            });
        }

        req.flash('success', 'friendship Added!');
        return res.redirect('back');

    }else{
        console.log("Outside");
        req.flash('error', 'friendship alredy exists!');
        return res.redirect('back');
    }


    }catch(err){
        req.flash('error', err);
        console.log(err);
    }

    return res.render('friend',{
        title: "Create"
    });
}



module.exports.createFriendship = async function(req, res){

    const ObjectId = mongoose.Types.ObjectId;

    try{

        let user = await User.findById(req.user.id); // to do id same as from_user
        let user_to_user = await User.findById(req.params.id); // to do id same as from_user

    let f2= await Friendship.findOne({ from_user:ObjectId(req.user.id) , to_user:ObjectId(req.params.id)});

    if(req.user.id==req.params.id){
        req.flash('error', 'Now Allowed !!!');
        return res.redirect('back');
    }

    if(f2==null){
        
        let new_friendship = await Friendship.create({
            from_user: req.user.id, // logged in user
            to_user: req.params.id // profile user
        });

        user.friendships.push(new_friendship); // adding in user Model friend Array

        user_to_user.friendships.push(new_friendship);// added to user 
        
        user.save();
        user_to_user.save();
       
        if (req.xhr){
            return res.status(200).json({
                data: {
                    friendship: friendship
                },
                message: "friendship created!"
            });
        }

        req.flash('success', 'friendship Added!');
        return res.redirect('back');

    }else{
        req.flash('error', 'friendship alredy exists!');
        return res.redirect('back');
    }


    }catch(err){
        req.flash('error', err);
        console.log(err);
    }

    return res.render('friend',{
        title: "Create"
    });
}



module.exports.deleteFriendship = async function(req, res){

    const ObjectId = mongoose.Types.ObjectId;
    
    try{

        let user = await User.findById(req.params.id); // to be same as req to be deleted

        // Check if friend is already exists
        let friendship = await Friendship.findOne({ from_user:ObjectId(req.user.id) , to_user:ObjectId(req.params.id)});
        letUserFriendModel = friendship;


        if(friendship != null){ // todo
            friendship.remove(); // remove

            // to remove it from User friendship array
            let Userfriendships = await User.findByIdAndUpdate(req.user.id, { $pull : {friendships : ObjectId(letUserFriendModel.id) }});
            let Userfriendships2 = await User.findByIdAndUpdate(req.params.id, { $pull : {friendships : ObjectId(letUserFriendModel.id) }});

            if (req.xhr){

                return res.status(200).json({
                    data: {
                        friendship: friendship
                    },
                    message: "friendship deleted"
                });
            }
            
            req.flash('success', 'friendship deleted!');
            return res.redirect('back');
        
        }else{
            req.flash('error', 'You cannot perform this task!');
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error', err);
        console.error("Eror deleting friendship",err);
        return;
    } 
}



module.exports.TodeleteFriendship = async function(req, res){

    const ObjectId = mongoose.Types.ObjectId;
    
    try{

        let user = await User.findById(req.params.id); // to be same as req to be deleted
        let friendship = await Friendship.findOne({ to_user:ObjectId(req.user.id) , from_user:ObjectId(req.params.id)});
      
        letUserFriendModel = friendship;

        if(friendship != null){ 

            friendship.remove(); // remove

            // to remove it from User friendship array
            let Userfriendships = await User.findByIdAndUpdate(req.user.id, { $pull : {friendships : ObjectId(letUserFriendModel.id) }});
            let Userfriendships2 = await User.findByIdAndUpdate(req.params.id, { $pull : {friendships : ObjectId(letUserFriendModel.id) }});

            if (req.xhr){

                return res.status(200).json({
                    data: {
                        friendship: friendship
                    },
                    message: "friendship deleted"
                });
            }
            
            req.flash('success', 'friendship deleted!');
            return res.redirect('back');
        
        }else{
            req.flash('error', 'You cannot perform this task!');
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error', err);
        console.error("Eror deleting friendship",err);
        return;
    }

}
