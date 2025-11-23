const { postClient } = require("../grpcClient");

const createPost = async (req, res) => {
  try {
    const { post } = req.body;
    const { id } = await postClient.createPost({ post });
    res.status(201).json({ success: true, data: id });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { post } = await postClient.getPost({ id });
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    console.error("Error getting post:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { post } = req.body;
  try {
    const data = await postClient.updatePost({ id, post });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
const likePost = async (req, res) => {
  const { id } = req.params;
  try {
    const { id } = await postClient.likePost({ id });
    res.status(200).json({ id });
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const commentPost = async (req, res) => {
  const { id } = req.params;
  try {
    const { comment } = req.body;
    const { id } = await postClient.commentPost({ id, comment });
    res.status(200).json({ success: true, data: id });
  } catch (error) {
    console.error("Error commenting post:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
module.exports = {
  commentPost,
  likePost,
  updatePost,
  getPost,
  createPost,
};
