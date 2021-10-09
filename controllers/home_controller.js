module.exports.home = function(req,res){


    //To access cookie
    console.log(req.cookies);

    // to set cookie
    res.cookie("User_id",10000);

    return res.render('home',{
        title: "Home"
    });

};

