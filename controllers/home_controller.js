
const Post = require('../models/post');
const User  = require('../models/users');

module.exports.home = async function(req,res){

    try{
        // populate the user of each post
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        });

        let users = await User.find({});

        return res.render('home',{
            title: "Codeial | Home",
            posts: posts,
            all_users: users
        });


    }catch(err){
        req.flash('error', err);
        console.error("Error Fetching Posts/Users from DB \n", err);
        return;
    }
}





// module.exports.actionName = function(req, res){}

    // //To access cookie we use req.cookies
    // console.log(req.cookies);
    // // to set cookie
    // res.cookie("User_id",10000)
