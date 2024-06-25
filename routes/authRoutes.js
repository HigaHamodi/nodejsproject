const express = require("express");
const { check, validationResult } = require("express-validator");
const { signup, login } = require("../controllers/authController");
const authRouter = express.Router();

authRouter.post(
  "/signup",
  [
    check("email").isEmail().withMessage("Must be a valid email"),
    check("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 chars long"),
    check("name.first").not().isEmpty().withMessage("First name is required"),
    check("name.last").not().isEmpty().withMessage("Last name is required"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    signup(req, res);
  }
);

authRouter.post(
  "/login",
  [
    check("email").isEmail().withMessage("Must be a valid email"),
    check("password").not().isEmpty().withMessage("Password is required"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    login(req, res);
  }
);

module.exports = authRouter;
