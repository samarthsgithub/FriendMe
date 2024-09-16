const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Tweet schema
const tweetSchema = new Schema({
  content: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 280, // Limiting tweet length to 280 characters
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Optionally include likes and comments if needed
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User', // Users who liked the tweet
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment', // Reference to Comment model if you have one
    },
  ],
});

// Create the Tweet model
const Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;
