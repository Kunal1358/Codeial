const express = require('express');
const passport = require('passport');

const router = express.Router();

const userController = require('../controllers/users_controller');

router.get('/profile',userController.profile);

/// sign in & up route
router.get('/sign-up',userController.signUp);

router.get('/sign-in',userController.signIn);

router.post('/create',userController.create); 


// use passport as middlewear
router.post('/create-session' , passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'}
)  ,userController.createSession );






module.exports = router;