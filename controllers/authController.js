const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const {
  newUserValidator,
  loginUserValidator,
} = require("../middleware/validationMiddleware");
const { JWT_SECRET } = require("../config/jwtConfig");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const userData = req.body;
    const validate = newUserValidator.validate(userData, { abortEarly: false });
    if (validate.error) {
      const error = validate.error.details[0].message;
      return res.status(406).json({ error: error });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      console.log(`Email already registered: ${userData.email}`);
      return res.status(400).json({ error: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;
    const user = new User(userData);
    const savedUser = await user.save();
    console.log(`User registered successfully: ${savedUser.email}`);
    res
      .status(201)
      .json({ message: "User successfully registered.", user: savedUser });
  } catch (error) {
    if (error.code === 11000) {
      console.log(`Duplicate email error: ${req.body.email}`);
      return res.status(400).json({ error: "Email is already registered." });
    }
    console.log(`Signup error: ${error}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validate = loginUserValidator.validate(req.body, {
      abortEarly: false,
    });
    if (validate.error) {
      const error = validate.error.details[0].message;
      return res.status(406).json({ error: error });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email Not Found" });
    }
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(429).json({
        message:
          "Your account has been locked after 3 attempts, please contact admin or wait 24 hours.",
      });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= 3) {
        user.lockUntil = Date.now() + 24 * 60 * 60 * 1000;
        user.loginAttempts = 0;
      }
      await user.save();
      return res
        .status(400)
        .json({ message: "Email or password is incorrect." });
    }
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.email;
    userObject.token = jwt.sign(
      {
        userId: userObject._id,
        isAdmin: userObject.isAdmin,
        IsBusiness: userObject.IsBusiness,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.send(userObject.token);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
