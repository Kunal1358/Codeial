const User = require('../models/users');
const path = require('path');
const fs = require('fs');
const Post = require('../models/post');
const Friendship = require('../models/friendship');

const Notification = require('../models/notification');
const mongoose= require('mongoose');

const PasswordResetToken = require('../models/PasswordResetToken');
const crypto = require('crypto');
const passwordResetMailer = require('../mailers/password_reset_mailer');



// Profile
module.exports.profile = async function(req,res){


  let profileUser = await User.findById(req.params.id,);

  // finding post
  let posts = await Post.find({'user':(req.params.id)})
  .sort('-createdAt')
  .populate('user')
  .populate({
      path: 'comments',
      populate: {
          path: 'user'
      },
      populate: { // populated likes
          path: 'likes'
      }
  }).populate('likes');


  let users = await User.find({});
  let friends = await Friendship.find({});

  return res.render('user_profile',{
      title: "User Profile",
      profile_user: profileUser,
      posts: posts,
      all_users: users,
      friend: friends
  });

  
};


// Update
module.exports.update = async function(req, res){
   

    if(req.user.id == req.params.id){

        try{

            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err){
                if (err) {console.log('*****Multer Error: ', err)}
                
                user.name = req.body.name;
                user.email = req.body.email;

                if (req.file){

                    // if (user.avatar){ // to replace existing file 
                    //     fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    // }

                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }


    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}

// render sign in page
module.exports.signUp = function(req,res){

    if(req.isAuthenticated()){ 
        return res.redirect('/users/profile');
    }

    return res.render('reges',{
        title: "Codial | sign Up"
    });
};


// render sign out page
module.exports.signIn = function(req,res){

    if(req.isAuthenticated()){ 
        return res.redirect('/users/profile');
    }


    return res.render('form',{
        title: "Codial | sign In"
    });
};


// get sign up data
module.exports.create = function(req,res){
   
    if(req.body.password != req.body.confirm_password){
        req.flash('error', 'Passwords do not match');
        return res.redirect('back');
    }

    User.findOne({email : req.body.email},function(error,user){
        if(error){req.flash('error', err); return;
        }
        if(!user){
            User.create(req.body,function(error,user){

                if(error){req.flash('error', error); return; }

                return res.redirect('/users/sign-in');

            })
        }else{
            req.flash('success', 'You have signed up, login to continue!');
            return res.redirect('back');
        }
    });

}


// Create sign in session
module.exports.createSession = function(req,res){
    
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');

};


// Sign Out
module.exports.destroySession = function(req,res){

    req.logout();
    req.flash('success', 'You have logged out!');  
    return res.redirect('/');

}



module.exports.getAllUsers = async function(req,res){

  let users = await User.find({});
  let profileUser = await User.findById(req.params.id);

  return res.render('all_Users',{
    title: "Users List",
    all_users: users,
    profile_user: profileUser
  })
}



// Notifications
module.exports.notifications = async function(req,res){


  const ObjectId = mongoose.Types.ObjectId;
  console.log(req.params.id);
  console.log(req.user.id);

  // Check if profile user is same as Login User
  if(req.params.id == req.user.id){ 
    console.log("safe User");

    let notificationUser = await User.findOne({_id: ObjectId(req.user.id)});
    // console.log("Noti User",notificationUser.id);

    let notifications =  await Notification.find({to_user: ObjectId(req.user.id)}).sort('-createdAt');
    // console.log(notifications);

    let all_notificationsUsers = await User.find({});
    let profileUser = await User.findById(req.params.id,);

    return res.render('Notification',{
      title: "Noty",
      notificationUser: notificationUser,
      notifications: notifications,
      all_notificationsUsers: all_notificationsUsers,
      profile_user: profileUser

    });
  
  

  }else{
    req.flash('error','Invalid Profile User' );
    console.log("You cannot Open this");
    return res.redirect('back');
  }

}



module.exports.updateNoti = async function(req,res){
  const ObjectId = mongoose.Types.ObjectId;

  const myNotifications = await Notification.find({to_user: req.user.id});
 

  // For single updation
  // let notificationRead = await Notification.findByIdAndUpdate(
  //   {_id:  ObjectId('6173ddc05666aaa808cfedb0')},
  //   {'isRead': true} // Updating Value of is Read
  // );
  

  // Updating isRead to true where it is false
    let notificationRead = await Notification.updateMany(
    { isRead: false, to_user: ObjectId(req.user.id) },
    {"$set":{'isRead': true}},
    { multi: true }

  );

  console.log(notificationRead);

  console.log("finish")

}



module.exports.as = async function(req,res){

  
  const ObjectId = mongoose.Types.ObjectId;
  console.log(req.params.id);
  console.log(req.user.id);

  // Check if profile user is same as Login User
  if(req.params.id == req.user.id){ 
    console.log("safe User");
  }else{
    req.flash('error','Invalid Profile User' );
    console.log("You cannot Open this");
    return res.redirect('back');
  }


  // let notificationUser = User.findById(req.params.id);
  // let notificationUser = await User.findOne({id: req.user.id});

  let notificationUser = await User.findOne({_id: ObjectId(req.user.id)});
  // {_id: ObjectId('617247d268563b045b1ce7f3')}
  // console.log("notificationUser\n", notificationUser);
  // console.log("notificationUser\n", notificationUser.name);
  console.log("notificationUser\n", notificationUser.id);

  try{

    let newNotification = await Notification.create({
      user: notificationUser.id,
      type: "Post",
      isRead: false,
      content: "SomeOne lIked Your Post"
    });        

    console.log(newNotification)

    req.flash('success', 'friendship Added!');
    return res.redirect('back');
  
    
  }catch(err){
    req.flash('error', err);
    console.log(err);
}

}



// Forgot Password
//create controller to render forget-password page
module.exports.forgotPassword = function (req, res) {
    if (req.isAuthenticated()) {
      return res.redirect("back");
    }
    return res.render("forgot_password", { // page to be created
      title: "Forget Password",
    });
  };


  //create controller to locate user by their email and send accessToken on their email
module.exports.sendPasswordResetToken = async function (req, res) {
    try {
      let user = await User.findOne({ email: req.body.email });

      if (user) {//if user found, create a password reset token
        let token = await PasswordResetToken.create({
          accessToken: crypto.randomBytes(20).toString("hex"),
          user: user,
          isValid: true,
        });
  
        //Enqueue the token in kue for it to be mailed
        passwordResetMailer.sendPasswordResetToken(token);
        // let job = await queue.create('reset-password-token', token).save(function(err){
        //     if(err){
        //         console.log('Error in enqueueing a job: ', err);
        //         return;
        //     }
        //     console.log('job enqueued:', job.id);
        // })
        //render reset information

        return res.render("reset_password_link", {
          title: "Account Recovery",
        });
      } else {
        return res.render("user_not_found", {
          title: "User not found",
        });
      }
    } catch (error) {
      console.log("Error in creating accessToken: ", error);
      req.flash("error", "Internal Server Error");
      return res.redirect("back");
    }
  };


  //constroller to validate access token and render a reset password form
module.exports.resetPassword = async function (req, res) {
    try {
      //check if the token exists in the database
      let token = await PasswordResetToken.findOne({
        accessToken: req.params.token,
      });
  
      //if token is valid, render password reset form
      if (token && token.isValid) {
        return res.render("reset_password", {
          title: "Reset Password",
          user_token: token,
        });
      } else {
        //else render 404
        return res.render("fourOfour", {
          title: "404",
        });
      }
    } catch (error) {
      console.log("Error in validating access token, ", err);
      req.flash("error", "Internal Server Error");
      return res.redirect("back");
    }
  };
  

  //controller to update new password
module.exports.updatePassword = async function (req, res) {
    try {
      //validate the new password with the new confirm password
      if (req.body.new_password != req.body.confirm_new_password) {
        req.flash("error", "Password and Confirm Password did not match");
        return res.redirect("back");
      }
  
      //Find user in database
      let user = await User.findById(req.body.user_id);
  
      //if user found, update password
      if (user) {
        user.password = req.body.new_password;
        user.save();
        let token = await PasswordResetToken.findById(req.body.token_id);
  
        //Also invalidate the token so the link becomes useless after one use
        token.isValid = false;
        token.save();
        req.flash("success", "Password changed Successfully!");
        return res.redirect("/users/sign-in");
      } else {
        return res.render("fourOfour", {
          title: "404",
        });
      }
    } catch (error) {
      console.log("Error in changing user password: ", error);
      req.flash("error", "Internal Server Error");
      return res.redirect("back");
    }
  };
  

// Github
  module.exports.GitHub = function(req, res){
    return res.redirect('https://github.com/Kunal1358/Codeial')
  }
