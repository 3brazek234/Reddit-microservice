// src/controllers/authController.js
const userClient = require("../grpcClient");

exports.signup = (req, res) => {
  const payload = {
    user: req.body
  };

  console.log("Sending gRPC CreateUser request:", payload);

  userClient.CreateUser(payload, (error, response) => {
    if (error) {
      console.error("gRPC Error:", error.details || error.message);
      let statusCode = 500;
      if (error.code === 6) statusCode = 409;
      if (error.code === 3) statusCode = 400;

      return res.status(statusCode).json({
        success: false,
        message: error.details || error.message
      });
    }

    res.status(201).json({
      success: true,
      data: response
    });
  });
};