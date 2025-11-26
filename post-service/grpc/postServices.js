// src/services/postServices.js
const grpc = require("@grpc/grpc-js");
const Post = require("../models/schemaPosts");
const userService = require("../grpc/userClient");
const Comment = require("../models/comment");
const Like = require("../models/like");

const postServices = {
  // --- دوال الـ Post الأساسية (create, get, update) ---
  // (تم تعديلها لتتوافق مع Mongoose)

  createPost: async (call, callback) => {
    const { title, authorId, subreddit_id, description } = call.request;

    // تحقق من وجود البيانات
    if (!title || !authorId || !subreddit_id) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        details: "Missing required fields (title, authorId, subredditId).",
      });
    }

    try {
      // استخدام Mongoose لإنشاء البوست
      const newPost = new Post({
        title,
        content: description, // الموديل بتاعك فيه content مش description
        author: authorId, // الموديل بتاعك فيه author
        subreddit: subreddit_id, // الموديل بتاعك فيه subreddit
      });
      await newPost.save();

      return callback(null, { post: newPost.toObject() });
    } catch (error) {
      console.error("Error creating post:", error);

      return callback({
        code: grpc.status.INTERNAL,
        details: "Internal server error while creating post.",
      });
    }
  },
  getUserDetails: (userId) => {
    return new Promise((resolve, reject) => {
      userService.getUser({ id: userId }, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  },
  getPost: async (call, callback) => {
    // this id of post to get its details
    const { id } = call.request;
    try {
      const post = await Post.findById(id);
      let authorDetails = {};
      try {
        authorDetails = await getUserDetails(post.author);
      } catch (userError) {
        console.error(
          `Failed to fetch author details for ID ${post.author}:`,
          userError
        );
        authorDetails = { id: post.author, username: "Unknown User" };
      }
      if (post) {
        const postResponse = {
          id: post._id.toString(),
          title: post.title,
          author_id: post.author._id.toString(),
          author_name: post.author.username,
          subreddit_id: post.subreddit._id.toString(),
          subreddit_name: post.subreddit.name,
          description: post.content,
        };
        callback(null, { post: postResponse });
      } else {
        return callback({
          code: grpc.status.NOT_FOUND,
          details: `Post with ID ${id} not found.`,
        });
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      return callback({
        code: grpc.status.INTERNAL,
        details: "Internal server error while fetching post.",
      });
    }
  },

  updatePost: async (call, callback) => {
    const { id, post: postData, user_id } = call.request;
    const { description, title } = postData;

    if (!id) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        details: "Post ID is required for update.",
      });
    }

    try {
      const existingPost = await Post.findById(id);
      if (!existingPost) {
        return callback({
          code: grpc.status.NOT_FOUND,
          details: `Post with ID ${id} not found.`,
        });
      }

      // التحقق من الصلاحية (هل المستخدم هو المؤلف؟)
      if (existingPost.author.toString() !== user_id) {
        return callback({
          code: grpc.status.UNAUTHORIZED,
          details: "User not authorized to update this post.",
        });
      }

      // التحديث باستخدام Mongoose
      if (title) existingPost.title = title;
      if (description) existingPost.content = description;

      const updatedPost = await existingPost.save();

      return callback(null, { post: updatedPost.toObject() });
    } catch (error) {
      console.error("Error updating post:", error);
      return callback({
        code: grpc.status.INTERNAL,
        details: "Internal server error while updating post.",
      });
    }
  },

  // --- دوال التفاعل (Like & Comment) ---

  likePost: async (call, callback) => {
    // id هنا هو post_id, user_id هو من يقوم باللايك
    const { id: postId, user_id: userId } = call.request;

    try {
      // 1. التأكد من وجود البوست أولاً
      const postExists = await Post.exists({ _id: postId });
      if (!postExists) {
        return callback({
          code: grpc.status.NOT_FOUND,
          details: `Post with ID ${postId} not found.`,
        });
      }

      // 2. محاولة إنشاء لايك جديد
      // الـ unique index في الـ Like schema هيمنع التكرار
      const newLike = new Like({
        user: userId,
        target: postId,
        targetModel: "Post", // نحدد أن الهدف هو بوست
      });

      await newLike.save();

      // الرد بالنجاح (ممكن ترجع true أو كائن اللايك)
      // نفترض الـ proto يتوقع success boolean
      return callback(null, { success: true });
    } catch (error) {
      // التعامل مع خطأ التكرار (Duplicate Key Error)
      if (error.code === 11000) {
        return callback(null, { success: true, message: "Already liked." });
      }

      console.error("Error liking post:", error);
      return callback({
        code: grpc.status.INTERNAL,
        details: "Internal server error while liking post.",
      });
    }
  },

  commentPost: async (call, callback) => {
    // id هنا هو post_id
    const {
      id: postId,
      user_id: userId,
      comment: commentContent,
    } = call.request;

    if (!commentContent) {
      return callback({
        code: grpc.status.INVALID_ARGUMENT,
        details: "Comment content is required.",
      });
    }

    try {
      // 1. التأكد من وجود البوست
      const postExists = await Post.exists({ _id: postId });
      if (!postExists) {
        return callback({
          code: grpc.status.NOT_FOUND,
          details: `Post with ID ${postId} not found.`,
        });
      }

      // 2. إنشاء التعليق
      const newComment = new Comment({
        content: commentContent,
        author: userId,
        post: postId,
      });

      await newComment.save();
      return callback(null, { comment: newComment.toObject() });
    } catch (error) {
      console.error("Error commenting on post:", error);
      return callback({
        code: grpc.status.INTERNAL,
        details: "Internal server error while commenting on post.",
      });
    }
  },
};

module.exports = postServices;
