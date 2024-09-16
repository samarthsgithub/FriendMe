const {User} = require("../models/User");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'yoursecretkey';
const userMiddleware = require('../middleware/user')
const mongoose = require('mongoose');


module.exports.signup = async function(req,res){
     
  const {email,username,password} = req.body;
  try{
    const existingUser = await User.findOne({username});
    if(existingUser){
        return res.status(400).json({message:"user already exist"});
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const newUser = new User({
        email,
        username,
        password:hashedPassword
    })
    await newUser.save();
    // generate web token;
    const token = jwt.sign({email:newUser.email,id:newUser._id},JWT_SECRET,{expiresIn:'1h'});
    res.status(201).json({message:"user created successfully",token});
  }catch(error){
    console.error(error);
    res.status(500).json({message:'server error'});
  }

}

module.exports.signin = async function(req,res){
    const{username,password} = req.body;
    try{
        const findUser = await User.findOne({username});
        if(!findUser){
            return res.status(400).json({message:"user doesnot exist"});
        }
        //Compare password
        const isPasswordCorrect = await bcrypt.compare(password,findUser.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message:"invalid credentials "});
        }
        const token = jwt.sign({username:findUser.username,id:findUser._id},JWT_SECRET,{expiresIn:'1h'});
        res.status(200).json({message:"Login successful",token});
    }catch(error){
        res.status(500).json({message:"sever error"});
    };
}

// controller to get the users profile
module.exports.me = async function(req,res){
    try{
        const userId = req.user.id;
        console.log("the user id is", userId);

        const user = await User.findById(userId).select('-password')
        .populate('friendRequests','username email')
        .populate('Friends' , 'username email');

        if(!user){
            return res.status(404).json({message:"User not found"});
        }
       console.log(user);
        res.status(200).json(user);
        
    }catch(error){
        console.error('Error fetching user data',error);
        res.status(500).json({message:"Internal server errlor"});
    }
};

// send friend request

module.exports.sendFriendRequest = async function (req,res){
    try{
        const{recipientId} = req.params;
        const senderId = req.user.id;

        const recipient = await User.findById(recipientId);
        const sender = await User.findById(senderId);
        if(senderId===recipientId){
            return res.status(400).json({
                message:"you are sending request to yourself"
            })
        }

        if(!recipient){
          return res.status(404).json({message:"User not found"});
        }

        if(recipient.Friends.includes(senderId)){
            return res.status(400).json({message:"You are already friends"});
        }
        if(recipient.friendRequests.includes(senderId)){
            return res.status(400).json({message:"Friend Request already sent"});
        }

        recipient.friendRequests.push(senderId);
        await recipient.save();
        res.status(200).json({message:"friend request sent"});
    }catch(error){
        console.error(error);
        res.status(500).json({message:"server error"});
    }
}

// accept friend request

module.exports.acceptFriendRequest = async function(req,res){
    try{
        const{senderId} = req.params;
        const recipientId = req.user.id;
        
        const recipient  = await User.findById(recipientId);
        const sender = await User.findById(senderId);

        if(!recipient || !sender){
            return res.status(404).json({message:"User not found"});
        }

        // Remove the friend request
        recipient.friendRequests = recipient.friendRequests.filter(id=>id.toString()!==senderId);

        // Add to each other friend List
        recipient.Friends.push(senderId);
        sender.Friends.push(recipientId);

        await recipient.save();
        await sender.save();
        
        res.status(200).json({
            message:"Friend request accepted"
        })

    }catch(error){
        console.error(error);
        res.status(500).json({message:"Server error"});
    }
};

// module to reject friend request(btw this could be easily done in one single function but its ok i guess)
module.exports.rejectFriendRequest = async function(req,res){
    try{
        const {senderId} = req.params;
        const recipientId = req.user.id;
        const recipient  = await User.findById(recipientId);
        const sender = await User.findById(senderId);

        if(!recipient || !sender){
            return res.status(404).json({message:"User not found"});
        }
        recipient.friendRequests = recipient.friendRequests.filter(id=>id.toString()!=senderId);
        await recipient.save();
        await sender.save();
        res.status(200).json({
            message:"Friend request rejected"
        })
    }catch(error){
       console.error(error);
       res.status(500).json({message:"server error"});
    }
};

// search users by username

module.exports.searchUsers = async function (req,res){
    const {username} = req.query;
    try{
        const users = await User.find({
         username:{$regex:username,$options:'i'}   
        }).select('username email');
        res.status(200).json(users);
    }catch(error){
        console.error(error);
        res.status(500).json({message:"server error"});
    }
};

// Find mutual friends 

module.exports.recommendFriends = async function(req,res){
    try{
        const userId = req.user.id;
        // fetch the current user
        const currentUser = await User.findById(userId).populate('Friends');
        console.log(currentUser);
        if(!currentUser){
            return res.status(404).json({message:"User not found"});
        }
        // Get the list of current user's friends;
        const currentFriendsIds = currentUser.Friends.map(friend=>friend._id.toString());
        // Find potential recommendations by mutual friends;

        const recommnededUsers = await User.find({
            _id:{$ne:userId,$nin:currentFriendsIds},
            Friends:{$in:currentFriendsIds},
            friendRequests:{$nin:userId},
        }).select('username email');

        res.status(200).json(recommnededUsers);
    }catch(error){
        console.error(error);
        res.status(500).json({message:"Server Error"});
    }
}
