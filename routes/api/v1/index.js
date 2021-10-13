const express = require('express');
const router = express.Router();


router.use('/posts',require('./posts'));
console.log('******* Going to users api v1');
router.use('/users', require('./users'));


module.exports = router;