const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    Friends :[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    friendRequests:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }]
});

const User = mongoose.model('User',UserSchema);

module.exports={
    User
}