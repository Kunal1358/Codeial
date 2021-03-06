const express = require('express');
const router = express.Router();

const homeController = require('../controllers/home_controller');

console.log("Router Loaded")

router.get('/',homeController.home);

router.use('/users',require('./users'));

router.use('/posts',require('./posts'));

router.use('/comments',require('./comments'));

router.use('/likes',require('./like'));

router.use('/api',require('./api'));

router.use('/friendships',require('./friendship'));


//for any further routes access from here
// app.use('/routeName',require('./route'));


module.exports=router;