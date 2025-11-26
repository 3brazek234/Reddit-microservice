const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true      
  },
  content: { 
    type: String,
    required: true
  },
author: {
    type: String,
    required: true
  },
  subreddit: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subreddit', 
    required: true
  },
}, {
  timestamps: true 
});

postSchema.index({ author: 1 });  
postSchema.index({ subreddit: 1 }); 

const Post = mongoose.model("Post", postSchema);
module.exports = Post;