// Aquire passport
const passport = require('passport');

// Aquire passport-local and property startegy
const LocalStartegy = require('passport-local').Strategy;
const User = require('../models/users');


passport.use(new LocalStartegy(
    { // defining username feild
        usernameField: "email",
        passReqToCallback: true
    },
    function(req,email,password,done){ // done is call back func

        User.findOne({email:email},function(error,user){// finding user by email
            if(error){ 
                req.flash('error', error);
                return done(error);
            }

            if(!user || user.password != password){ //  if auth is not done then return
                req.flash('error', 'Invalid Username/Password');
                return done(null,false);
            }
            // else return the user
            return done(null,user);

        });
    }

));

// Serializing the user to decide which key is to be stored in cookies
passport.serializeUser(function(user,done){
     done(null,user.id); // encrypt the user id in cookie
});


// deserializing the user from the key in the cookies

passport.deserializeUser(function(id,done){
    User.findById(id,function(error,user){
        if(error){ 
            console.error("Error in finding user --> Passport");
            return done(error);
        }
        done(null,user);

    });
});


// check if the user is authenticated
passport.checkAuthentication = function(req, res, next){
    // if the user is signed in, then pass on the request to the next function(controller's action)
    if (req.isAuthenticated()){
        return next();
    }

    // if the user is not signed in
    return res.redirect('/users/sign-in');
}



passport.setAuthenticatedUser = function(req, res, next){

    if (req.isAuthenticated()){
        // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user;
    }

    next();
}












module.exports = passport;