const { application } = require('express');
const express = require('express');

const router = express.Router();

const homeController = require('../controllers/home_controller');


router.get('/',homeController.home);

//test
// router.get('/home2',homeController.profile);

router.use('/users',require('./users'));

//for any further routes access from here
// app.use('/routeName',require('./route'));







module.exports=router;