const { application } = require('express');
const express = require('express');

const router = express.Router();

const homeController = require('../controllers/home_controller');


router.get('/',homeController.home);

//test
router.get('/home2',homeController.profile);








module.exports=router;