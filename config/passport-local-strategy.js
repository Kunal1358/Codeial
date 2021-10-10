// Aquire passport
const passport = require('passport');

// Aquire passport-local and property startegy
const LocalStartegy = require('passport-local').Strategy;
const User = require('../models/users');


passport.use(new LocalStartegy(
    { // defining username feild
        usernameField: "email"
    },
    function(email,password,done){ // done is call back func

        User.findOne({email:email},function(error,user){// finding user by email
            if(error){ 
                console.error("Error in finding user --> Passport");
                return done(error);
            }

            if(!user || user.password != password){ //  if auth is not done then return
                console.error("Invalid username/password");
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


module.exports = passport;