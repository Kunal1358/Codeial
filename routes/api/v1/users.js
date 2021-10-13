const express = require('express');
const router = express.Router();
const userApi = require('../../../controllers/api/v1/user_api');

console.log('******* Inside  users api v1');


router.post('/create-session', userApi.createSession);


module.exports = router;

