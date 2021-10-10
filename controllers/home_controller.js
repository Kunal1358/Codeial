module.exports.home = function(req,res){

    //To access cookie we use req.cookies
    console.log(req.cookies);

    // to set cookie
    res.cookie("User_id",10000);

    return res.render('home',{
        title: "Home"
    });

};

// module.exports.actionName = function(req, res){}