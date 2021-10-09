const user = require('../models/users');
const User = require('../models/users');

module.exports.profile = function(req,res){

    return res.render('users_profile',{
        title: "users_profile"
    });

};

// render sign in page
module.exports.signUp = function(req,res){

    return res.render('user_sign_up',{
        title: "Codial : sign Up"
    });
};

// render sign out page
module.exports.signIn = function(req,res){

    return res.render('user_sign_in',{
        title: "Codial : sign In"
    });
};

// get sign up data
module.exports.create = function(req,res){
   
    if(req.body.password!=req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email : req.body.email},function(error,user){
        if(error){ console.log("Error Creating User with create: ", error); return;
        }
        if(!user){
            User.create(req.body,function(error,user){

                if(error){ console.log("Error Creating While Signing Up: ", error); return; }

                return res.redirect('/users/sign-in');

            })
        }else{
            return res.redirect('back');
        }
    })

};

// Create sign in session
module.exports.createSession = function(req,res){
    //TODO later

};

