const express = require('express');
const router = express.Router();
const tweetController = require('../controllers/tweetController');
const {userMiddleware} = require('../middleware/user');



router.post('/post-tweet',userMiddleware,tweetController.postTweet);
router.get('/feed',userMiddleware,tweetController.getFeed);


module.exports = router;