const { Subreddit } = require("../models/subredditSchema");
const grpc = require("@grpc/grpc-js"); 


const subredditImplementation = {
  createSubreddit: async (call, callback) => {
    const { name, description } = call.request;

    try {
      const newSubreddit = await Subreddit.create({
        name,
        description,
      });
      const response = {
        id: newSubreddit._id.toString(),
        name: newSubreddit.name,
        description: newSubreddit.description,
      };
      callback(null, response);
    } catch (err) {
      console.error("Error creating subreddit:", err);
      if (err.code === 11000) {
        return callback({
          code: grpc.status.ALREADY_EXISTS,
          details: `Subreddit with name '${name}' already exists.`,
        });
      }
      if (err.name === "ValidationError") {
        return callback({
          code: grpc.status.INVALID_ARGUMENT,
          details: err.message,
        });
      }
      return callback({
        code: grpc.status.INTERNAL,
        details: "Internal server error while creating subreddit.",
      });
    }
  },
  
};

module.exports = subredditImplementation;
