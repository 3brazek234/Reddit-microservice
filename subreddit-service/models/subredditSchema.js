const mongoose = require("mongoose");
const { type } = require("os");
const Schema = mongoose.Schema;

// Subreddit Schema
const SubredditSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 21,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  subscribers_count: {
    type: Number,
    default: 0
  },
});
const SubredditUserSchema = new Schema({
  subredditId: {
    type: Schema.Types.ObjectId,
    ref: Subreddit,
    required: true,
  },
  userId: {
    type: Number,
    required: true,
  },
});
const Subreddit = mongoose.model("Subreddit", SubredditSchema);
const SubredditUsers = mongoose.model("SubredditUser", SubredditUserSchema);
module.exports = { Subreddit, SubredditUsers };
