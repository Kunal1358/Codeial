const express = require('express');
const router = express.Router();

const friendshipController = require('../controllers/friendship_controller');

// router.post('/toggle',friendshipController.toggleFriendship);


router.get('/create/:id',friendshipController.createFriendship);

router.get('/delete/:id',friendshipController.deleteFriendship);

router.get('/delete/req/:id',friendshipController.TodeleteFriendship);



module.exports=router;