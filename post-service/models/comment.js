// models/Comment.js
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
     type : String,
     required : true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
  }
}, {
  timestamps: true
});


commentSchema.index({ post: 1, createdAt: -1 }); 

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;