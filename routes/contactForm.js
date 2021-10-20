const express = require('express');
const router = express.Router();

console.log("///////////////////    Inside Route     ////////////////////////");


const contactController = require('../controllers/contactForm_controller');

// router.post('/create',postController.create);
router.get('/contact',contactController.contactUs);

module.exports = router;