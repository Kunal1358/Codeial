
const Post = require('../models/Post');

module.exports.home = function(req,res){

    // //To access cookie we use req.cookies
    // console.log(req.cookies);

    // // to set cookie
    // res.cookie("User_id",10000);

    // Post.find({},function(err,posts){

    //     if(err){console.error("Error Fetchinng the Posts from DB", err); return;}

    //     return res.render('home',{
    //         title: "Codeial | Home",
    //         Post: posts
    //     });


    // });


    Post.find({}).populate('user').exec(function(err,posts){

        if(err){console.error("Error Fetchinng the Posts from DB \n", err); return;}

        return res.render('home',{
            title: "Codeial | Home",
            posts: posts
        });

    })

}

// module.exports.actionName = function(req, res){}