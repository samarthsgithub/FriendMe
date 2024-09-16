const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userController');
const {redirectIfAuthenticated,userMiddleware} = require('../middleware/user');


router.post('/signup',redirectIfAuthenticated,usersController.signup);
router.post('/signin',redirectIfAuthenticated,usersController.signin);
router.get('/me',userMiddleware,usersController.me);
// send Friend Request
router.post('/send-request/:recipientId',userMiddleware,usersController.sendFriendRequest);
// accept freind request;
router.post('/accept-request/:senderId',userMiddleware,usersController.acceptFriendRequest);
// reject a friend request;
router.post('/reject-request/:senderId',userMiddleware,usersController.rejectFriendRequest);
// search a user
router.get('/search', usersController.searchUsers);
// find recommeded users
router.get('/recommend-friends', userMiddleware,usersController.recommendFriends);


module.exports = router;