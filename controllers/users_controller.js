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


module.exports.update = function(req,res){

    if(req.user.id == req.params.id){

        User.findByIdAndUpdate(req.params.id,req.body,function(err,user){

            if(err){ console.log("Error Finding User in DB \n", err); return;}
            req.flash('success', 'Updated!');
            return res.redirect('back');

        })

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
