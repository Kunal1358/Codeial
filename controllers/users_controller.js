const User = require('../models/users');

module.exports.profile = function(req,res){

    // check if user id exist in cookie
    if(req.cookies.user_id){
        User.findById(req.cookies.user_id,function(error,user){

            if(error){ console.log("Error accessing the user profile ", error); return;}

            if(user){ // if user exist show his profile

                return res.render('users_profile',{
                    title: "User Profile",
                    user:user
                });

            }else{ // send him to sign in page
                return res.redirect('/users/sign-in');
            }

        });
    }else{
        return res.redirect('/users/sign-in');
    }

};

// render sign up page
module.exports.signUp = function(req,res){

    return res.render('user_sign_up',{
        title: "Codial : sign Up"
    });
};

// render sign in page
module.exports.signIn = function(req,res){

    return res.render('user_sign_in',{
        title: "Codial : sign In"
    });
};

// get sign up data
module.exports.create = function(req,res){
   
    // check if both passowrd are same or not
    if(req.body.password!=req.body.confirm_password){
        return res.redirect('back');
    }

    // find user by his email id
    User.findOne({email : req.body.email},function(error,user){
        if(error){ console.log("Error Creating User with create: ", error); return;
        }
        if(!user){ // if user doesn't exist then create user

            User.create(req.body,function(error,user){ // create user

                if(error){ console.log("Error Creating While Signing Up: ", error); return; }

                return res.redirect('/users/sign-in');

            })
        }else{ // redirect him back
            return res.redirect('back');
        }
    });

};

// Create sign in session
module.exports.createSession = function(req,res){
    //TODO later

    // find the user
    User.findOne({email:req.body.email},function(error,user){

        if(error){ console.log("Error Creating User with create: ", error); return;}

        // if user exist
        if(user){ // check is password doesn't match 
            if(user.password!=req.body.password){
                return res.redirect('back');
            }
            // if passowrd matches then create a session
            res.cookie("user_id",user.id);
            return res.redirect('/users/profile');

        }else{
            return res.redirect('back');
        }
        
    });
};

// Sign Out todo 