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
    //TODO later

};

// Create sign in session
module.exports.createSession = function(req,res){
    //TODO later

};

