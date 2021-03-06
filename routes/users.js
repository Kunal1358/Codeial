const express = require('express');
const router = express.Router();
const passport = require('passport');

const userController = require('../controllers/users_controller');

router.get('/profile/:id' , passport.checkAuthentication ,userController.profile);
router.post('/update/:id' , passport.checkAuthentication ,userController.update);

/// sign in & up route
router.get('/sign-up',userController.signUp);
router.get('/sign-in',userController.signIn);
router.post('/create',userController.create); 

// use passport as middlewear
router.post('/create-session' , passport.authenticate(
    'local',
    {failureRedirect: '/users/sign-in'}
)  ,userController.createSession );

router.get('/sign-out',userController.destroySession); 

//google auth routers
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']})); // email is not a part of profile
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/sign-in'}), userController.createSession);

// Reset Password
router.get('/forgot-password', userController.forgotPassword);
router.post('/account-recovery', userController.sendPasswordResetToken);
router.get('/reset-password/:token', userController.resetPassword);
router.post('/submit-new-password', userController.updatePassword);

// Notifications
router.get('/notifications/:id', userController.notifications);
router.get('/allUsers/:id', userController.getAllUsers );
router.get('/update-notification/:id', userController.updateNoti );

// GitHUb
router.get('/git',userController.GitHub);


module.exports = router;