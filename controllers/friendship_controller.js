const User = require('../models/users');
const Friendship = require('../models/friendship');

const Post = require('../models/post');

const mongoose= require('mongoose');

const queue = require('../config/kue');

const likeMailer = require('../mailers/likes_mailer');
const likeEmailWorker = require('../worker/like_email_worker');


// module.exports.toggleFriendship = async function(req, res){

//     try{

//         let friends;
//         let unFriends = false;

//         // Current User ?
//         friend = await User.findById(req.query.id);

//         // check if friend already exists
//         let existingFriend = User.findOne({
//             from_user: req.query.id,
//             to_user: req.user._id
//         });

//         // If friend already exists Then delete it
//         if(existingFriend){
            
//             friends.friendship.pull(existingFriend._id);
//             friends.save();

//             existingFriend.remove();
//             unFriends = true;


//         }else{ // Add as friend

//             // let newFriend = await 

//             let newFriend = await Friendship.create({
//                 from_user: req.user._id,
//                 to_user: req.query.id
//             });

//             friends.friendship.push(newFriend._id);
//             friends.save();

//         }
        
//     }catch(err){
//         console.log(err);
//         return res.json(500, {
//             message: 'Internal Server Error'
//         });
//     }

// }


module.exports.toggleFriendship = function(req, res){
    return res.render('friend',{
        title: "Test 2"
    });
}



module.exports.createFriendship = async function(req, res){

    console.log("Creating Friend");
    const ObjectId = mongoose.Types.ObjectId;


    console.log( "Logged in User ID", req.user.id);
    // req.user = logged in Users
    // req sender

    console.log( "Req", req.params.id);
    // profile User 
    // Friend to be added

    try{

        let user = await User.findById(req.user.id); // to do id same as from_user
        let user_to_user = await User.findById(req.params.id); // to do id same as from_user

        console.log(user.id);
        console.log(user_to_user.id);

        // let postTest = await Post.find({})

        // console.log('Login User  fetched ----------------------------------------------------',user.id);

        // let sendUser = await User.findById(req.params.id);
        // console.log('Profile User  fetched ----------------------------------------------------',sendUser.id);

       
  // todo if else

//   console.log('================================ Before error',  req.params.id  );
    // let friendship = await Friendship.findOne({to_user : {to_user: ObjectId(req.params.id)}});
    // let friendship = await Friendship.find({to_user: ObjectId(req.params.id)});

    // let friendship =Friendship.findOne({to_user: req.params.id}, function(err,fs){
    //     if(err){console.log("-----------------------------------------------------------------------------------\n",err); return;}
    // })

    console.log("-----------------------------------------------------------------------------------");
    console.log(mongoose.Types.ObjectId.isValid(req.params.id));
    console.log("-----------------------------------------------------------------------------------");
    

    
    // let friendship = Friendship.find(ObjectId('61718ca4057af62520711f5e'));
    // let friendship = Friendship.find({to_user:req.params.id},function(err,friendship){
    //     if(err){console.log('+++++++++++++++++++++++++\n', err); return;}
    //     if(!friendship){
    //         console.log("{}{}{}{}{}{}{}GOTCHA");
    //     }else{
    //         console.log("}{}{}{}{}{Outside");
    //     }
    // });

    // let friendship = Friendship.find({to_user:req.params.id});

    // if(Friendship.find({to_user:ObjectId(req.params.id)}).count() > 0){
    //     console.log('Count = 1');
    // }else{
    //     console.log('Count = 0');
    // }

    let friendAlredy = false;

    // let f2= Friendship.findOne({to_user:ObjectId(req.params.id)},function(err,friendship){
    //     if(err){console.log('+++++++++++++++++++++++++\n', err); return;}
    //     if(friendship==null){
    //         console.log("Friend Does'nt exists");
    //          console.log(friendship);
    //     }else{
    //         friendAlredy = true;
    //         console.log("Friend Exists");
    //          console.log(friendship);
    //     }
    // })

// Main
    // let f2= await Friendship.findOne({to_user:ObjectId(req.params.id)});

    let f2= await Friendship.findOne({ from_user:ObjectId(req.user.id) , to_user:ObjectId(req.params.id)});

    console.log(f2);

    if(f2 == null){
        console.log("----------------------------------------------------------------------------------- Not Exists ");
    }else{
        console.log(" Exists  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++s  Exists");
    }


    // console.log("-----------------------------------------------------------------------------------");
    // // console.log(friendship);
    // console.log("-----------------------------------------------------------------------------------");

    // //     if(!friendship){
    // //     console.log("GOTCHA");
    // // }else{
    // //     console.log("Outside");
    // // }






    if(f2==null){
        console.log("GOTCHA");
        
        let new_friendship = await Friendship.create({
            from_user: req.user.id, // logged in user
            to_user: req.params.id // profile user
        });

        user.friendships.push(new_friendship); // adding in user Model friend Array

        user_to_user.friendships.push(new_friendship);// added to user 
        
        user.save();
        user_to_user.save();
       
        if (req.xhr){
            return res.status(200).json({
                data: {
                    friendship: friendship
                },
                message: "friendship created!"
            });
        }

        req.flash('success', 'friendship Added!');
        return res.redirect('back');

        


    }else{
        console.log("Outside");
        req.flash('error', 'friendship alredy exists!');
        return res.redirect('back');
    }


    }catch(err){
        req.flash('error', err);
        console.log(err);
    }



    return res.render('friend',{
        title: "Create"
    });
}


module.exports.createFriendship = async function(req, res){

    console.log("Creating Friend");
    const ObjectId = mongoose.Types.ObjectId;


    console.log( "Logged in User ID", req.user.id);
    // req.user = logged in Users
    // req sender

    console.log( "Req", req.params.id);
    // profile User 
    // Friend to be added

    try{

        let user = await User.findById(req.user.id); // to do id same as from_user
        let user_to_user = await User.findById(req.params.id); // to do id same as from_user

        console.log(user.id);
        console.log(user_to_user.id);


        console.log("-----------------------------------------------------------------------------------");
        console.log(mongoose.Types.ObjectId.isValid(req.params.id));
        console.log("-----------------------------------------------------------------------------------");

    let f2= await Friendship.findOne({ from_user:ObjectId(req.user.id) , to_user:ObjectId(req.params.id)});

    console.log(f2);

    if(f2 == null){
        console.log("----------------------------------------------------------------------------------- Not Exists ");
    }else{
        console.log(" Exists  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++s  Exists");
    }

    if(req.user.id==req.params.id){
        console.log("Outside");
        req.flash('error', 'Now Allowed !!!');
        return res.redirect('back');
    }

    if(f2==null){
        console.log("GOTCHA");
        
        let new_friendship = await Friendship.create({
            from_user: req.user.id, // logged in user
            to_user: req.params.id // profile user
        });
        console.log(" ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^6 ");
        console.log(user);

        user.friendships.push(new_friendship); // adding in user Model friend Array

        user_to_user.friendships.push(new_friendship);// added to user 
        
        user.save();
        user_to_user.save();
       
        if (req.xhr){
            return res.status(200).json({
                data: {
                    friendship: friendship
                },
                message: "friendship created!"
            });
        }

        req.flash('success', 'friendship Added!');
        return res.redirect('back');

        


    }else{
        console.log("Outside");
        req.flash('error', 'friendship alredy exists!');
        return res.redirect('back');
    }


    }catch(err){
        req.flash('error', err);
        console.log(err);
    }



    return res.render('friend',{
        title: "Create"
    });
}



// module.exports.createFriendship = function(req, res){
//     console.log("Indie ***********************************************************************************");


//     console.log( "Logged in User ID", req.user.id);
//     // req.user = logged in Users
//     // req sender

//     console.log( "Req", req.params);
//     // profile User 
//     // Friend to be added

//         return res.render('friend',{
//             title: "Create"
//         });
    
// }



module.exports.deleteFriendship = async function(req, res){

    // let loginUser = await User.findById(req.user.id); // to do id same as from_user
    // let ProfileUser = await User.findById(req.params.id); // to do id same as from_user

    // console.log( "Login User -> ", loginUser.id);
    // console.log( "Profile User -> ", ProfileUser.id);

    const ObjectId = mongoose.Types.ObjectId;
    
    try{

        let user = await User.findById(req.params.id); // to be same as req to be deleted
        console.log( "User Id->", user.id);


        // Check if friend is already exists
        // let friendship= await Friendship.findOne({to_user:ObjectId(req.params.id)});
        let friendship = await Friendship.findOne({ from_user:ObjectId(req.user.id) , to_user:ObjectId(req.params.id)});
        // console.log(friendship);
        // console.log("F.id",friendship);
        letUserFriendModel = friendship;

        console.log("TTTTTTTTTTTTTTTTTTTTTTTest = ->>>>>>>>>.   ", letUserFriendModel.id )
    
        if(friendship == null){ 
            console.log("----------------------------------------------------------------------------------- not found");
        }else{
            console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++s  Exists");
        }

        //  if + user is found
        //  - user not found

        // todo: check

        if(friendship != null){ // todo

            friendship.remove(); // remove

            // to remove it from User friendship array

            console.log("Req.user.id", req.user.id);

            let Userfriendships = await User.findByIdAndUpdate(req.user.id, { $pull : {friendships : ObjectId(letUserFriendModel.id) }});

            let Userfriendships2 = await User.findByIdAndUpdate(req.params.id, { $pull : {friendships : ObjectId(letUserFriendModel.id) }});

            if (req.xhr){

                return res.status(200).json({
                    data: {
                        friendship: friendship
                    },
                    message: "friendship deleted"
                });
            }
            
            req.flash('success', 'friendship deleted!');
            return res.redirect('back');
        
        }else{
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error', err);
        console.error("Eror deleting friendship",err);
        return;
    }


    
}

module.exports.TodeleteFriendship = async function(req, res){

    const ObjectId = mongoose.Types.ObjectId;
    
    try{

        let user = await User.findById(req.params.id); // to be same as req to be deleted

        let friendship = await Friendship.findOne({ to_user:ObjectId(req.user.id) , from_user:ObjectId(req.params.id)});
      
        letUserFriendModel = friendship;

        // todo: check

        if(friendship != null){ // todo

            friendship.remove(); // remove

            // to remove it from User friendship array

            // console.log("Req.user.id", req.user.id);

            let Userfriendships = await User.findByIdAndUpdate(req.user.id, { $pull : {friendships : ObjectId(letUserFriendModel.id) }});
            let Userfriendships2 = await User.findByIdAndUpdate(req.params.id, { $pull : {friendships : ObjectId(letUserFriendModel.id) }});

            if (req.xhr){

                return res.status(200).json({
                    data: {
                        friendship: friendship
                    },
                    message: "friendship deleted"
                });
            }
            
            req.flash('success', 'friendship deleted!');
            return res.redirect('back');
        
        }else{
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }

    }catch(err){
        req.flash('error', err);
        console.error("Eror deleting friendship",err);
        return;
    }

}






// module.exports.TodeleteFriendship = async function(req, res){


    


//     return res.render('fourOfour',{
//         title: "To dlete req"
//     })

    
// }















module.exports.test = async function(req, res){
   
    

    // let friendship = await Friendship.findOne({to_user:"6167a8cb5ed8e6f51419b779"});

    // if(!friendship){
    //     console.log("GOTCHA");
    // }else{
    //     console.log("Outside");
    // }


    // let new_friendship = await Friendship.create({
    //     from_user: "61638f685ebcbaf92ae35fa0", // logged in user
    //     to_user: "6163a607d2ae2f18a8abc918" // profile user
    // });
    // return res.end;

    // let friend  = Friendship.findById({ to_user : "6163a607d2ae2f18a8abc918" });
    // console.log(friend);


    const ObjectId = mongoose.Types.ObjectId;

    // let friend  = User.aggregate([
    //     {
    //         $to_user: { _id: ObjectId('6163a607d2ae2f18a8abc918') }
    //     }
    //     ])      

    
    
    // let friend  = Friendship.findOne({to_user: ObjectId('6167a8cb5ed8e6f51419b779')});

       

    //         if(!friend){
    //     console.log("GOTCHA");
    //     console.log("Fr->",friend);
    // }else{
    //     console.log("Outside");
    //     // console.log("Fr->",friend);
    // }


}