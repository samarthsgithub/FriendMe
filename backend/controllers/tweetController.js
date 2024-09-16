const Tweet  = require('../models/Tweet');
const {User}   = require('../models/User');
const mongoose = require('mongoose');


module.exports.postTweet = async function (req,res){
    try{
        const{content} = req.body;
        const user = req.user.id;

        if(!content){
            return res.status(400).json({error:'content is required'});
        }
        const tweet = new Tweet({content,user});
        await tweet.save();
        res.status(201).json(tweet);
    }catch(error){
         console.error('Error creating tweet:',error);
         res.status(500).json({error:'Internal server error'});
    }
}

module.exports.getFeed = async function(req,res){
    try{
        const userId = req.user.id;
        const user = await User.findById(userId).populate('Friends').exec();

        // Extract friend Ids and self ID
        const friendIds = user.Friends.map(friend=>friend._id);
        friendIds.push(userId);

        // Find tweets by the user and their friends
        const tweets = await Tweet.find({user:{$in:friendIds}})
                              .sort({createdAt:-1})
                              .populate('user','username')
                              .exec();

        res.status(200).json(tweets);
    }catch(error){
        console.error('Error fetching feeds:',error);
        res.status(500).json({error:"Internal server errror"});
    }
}

