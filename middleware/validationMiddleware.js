const Joi = require("joi");

const userValidatorSchema = Joi.object({
  name: Joi.object({
    first: Joi.string().min(2).max(50).required(),
    middle: Joi.string().min(2).max(50).allow(""),
    last: Joi.string().min(2).max(50).required(),
  }).required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  phone: Joi.string()
    .pattern(/^(0[2-4,8-9][0-9]{7}|0[57,73,74,76-79]{2}[0-9]{7})$/)
    .message("Please provide a valid Israeli phone number for the user's phone")
    .required(),
  address: Joi.object({
    state: Joi.string().allow(""),
    country: Joi.string().min(2).max(256).required(),
    city: Joi.string().min(2).max(256).required(),
    street: Joi.string().min(2).max(256).required(),
    houseNumber: Joi.number().required(),
    zip: Joi.number(),
  }),
  image: Joi.object({
    url: Joi.string()
      .pattern(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/)
      .message("Image URL must be a valid URL")
      .allow(""),
    alt: Joi.string().min(2).max(256).allow(""),
  }),
});

exports.newUserValidator = userValidatorSchema.append({
  password: Joi.string()
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?!.*\s).{7,20}$/)
    .message(
      "Password must be between 7 and 20 characters long and contain at least one digit, one uppercase letter, one lowercase letter, and one special character (!@#$%^&*)"
    )

    .required(),
});

exports.editUserValidator = userValidatorSchema;

exports.loginUserValidator = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi.string()
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?!.*\s).{7,20}$/)
    .message(
      "Password must be 7-20 characters long and include at least one digit, one uppercase letter, one lowercase letter, and one special character (!@#$%^&*)"
    )
    .required(),
});

exports.cardValidator = Joi.object({
  title: Joi.string().required().min(2).max(100),
  subtitle: Joi.string().required().min(2).max(100),
  description: Joi.string().required().min(10).max(500),
  phone: Joi.string()
    .pattern(/^(0[2-4,8-9][0-9]{7}|0[57,73,74,76-79]{2}[0-9]{7})$/)
    .message("Please provide a valid Israeli phone number for the user's phone")
    .required(),
  web: Joi.string()
    .pattern(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/)
    .message("Web URL must be a valid URL")
    .allow(""),
  image: Joi.object({
    url: Joi.string()
      .pattern(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/)
      .message("Image URL must be a valid URL")
      .allow(""),
    alt: Joi.string().min(2).max(256).allow(""),
  }).required(),
  address: Joi.object({
    state: Joi.string().allow(""),
    country: Joi.string().min(2).max(256).required(),
    city: Joi.string().min(2).max(256).required(),
    street: Joi.string().min(2).max(256).required(),
    houseNumber: Joi.number().required(),
    zip: Joi.number(),
  }).required(),
});
