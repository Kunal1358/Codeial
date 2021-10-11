const User = require('../models/users');

module.exports.profile = function(req,res){

    User.findById(req.params.id, function(err,user){

        if(err){ console.log("Error Finding User in DB \n", err); return;}

        return res.render('user_profile',{
            title: "User Profile",
            profile_user: user
        });
    });


   

};

// render sign in page
module.exports.signUp = function(req,res){

    if(req.isAuthenticated()){ 
        return res.redirect('/users/profile');
    }

    return res.render('user_sign_up',{
        title: "Codial | sign Up"
    });
};

// render sign out page
module.exports.signIn = function(req,res){

    if(req.isAuthenticated()){ 
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_in',{
        title: "Codial | sign In"
    });
};

// get sign up data
module.exports.create = function(req,res){
   
    if(req.body.password != req.body.confirm_password){
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
    });

}

// Create sign in session
module.exports.createSession = function(req,res){
    
    return res.redirect('/');

};

// Sign Out
module.exports.destroySession = function(req,res){

    req.logout();
    
    return res.redirect('/');

}
