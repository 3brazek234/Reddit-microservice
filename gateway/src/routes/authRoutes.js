const express = require("express");
require("dotenv").config();
const authController = require("../controllers/authController");
const { signupSchema } = require("../validtion/schemas");
const validateRequest = require("../middlewares/validator");

const router = express.Router();
router.post(
  "/signup",
  validateRequest(signupSchema, "body"),
  authController.signup
);
router.post("/login", authController.login);
module.exports = router;
