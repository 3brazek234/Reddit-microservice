const Joi = require("joi");

const signupSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .required()
    .messages({
      "string.pattern.base":
        "Password must be between 8-30 characters and contain only letters and numbers.",
    }),
});
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .required()
    .messages({
      "string.pattern.base":
        "Password must be between 8-30 characters and contain only letters and numbers.",
    }),
});
module.exports = {
  signupSchema,
  loginSchema,
};
