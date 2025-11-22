const Joi = require("joi");

const signupSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{8,30}$")) 
    .required()
    .messages({
      "string.pattern.base":
        "Password must be between 8-30 characters and contain only letters and numbers.",
    }),
});

module.exports = {
  signupSchema,
};
