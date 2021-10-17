const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');


const userSchema = new mongoose.Schema({
    email:{
        type : String,
        required : true,
        unique : true
    },
    password:{
        type : String,
        required : true
    },
    name: {
        type : String,
        required : true
    },
    avatar: {
        type: String
    },
    friendships: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Friendship'
        }
    ]
},{
    timestamps:true
});


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, '/tmp/my-uploads')
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//       cb(null, file.fieldname + '-' + uniqueSuffix)
//     }
//   })


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now());
    }
  });



  //static Methods
userSchema.statics.uploadedAvatar = multer({storage:  storage}).single('avatar'); // .single() -> only 1 instance or file will be uploaded for avatar
userSchema.statics.avatarPath = AVATAR_PATH; // to be avavilable publically for user model


const User = mongoose.model('User',userSchema);

module.exports = User;