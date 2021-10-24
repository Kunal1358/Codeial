const User = require('../models/users');
const path = require('path');
const fs = require('fs');
const Post = require('../models/post');

const PasswordResetToken = require('../models/PasswordResetToken');
const crypto = require('crypto');
const passwordResetMailer = require('../mailers/password_reset_mailer');


module.exports.profile = async function(req,res){

    let user = await User.findById(req.params.id,);

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


    return res.render('user_profile',{
        title: "User Profile",
        profile_user: user,
        posts: posts
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
  