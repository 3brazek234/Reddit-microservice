const mongoose = require("mongoose");
const likeSchema = new mongoose.Schema(
  {
    user: {
      type: "string",
      required: true,
    },

    target: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "targetModel",
    },
    targetModel: {
      type: String,
      required: true,
      enum: ["Post", "Comment"],
    },
  },
  {
    timestamps: true,
  }
);

likeSchema.index({ user: 1, target: 1, targetModel: 1 }, { unique: true });

const Like = mongoose.model("Like", likeSchema);
module.exports = Like;
