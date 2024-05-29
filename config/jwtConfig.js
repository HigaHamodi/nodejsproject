const env = require("dotenv").config();
const jwt = require("jsonwebtoken");
exports.JWT_SECRET = env.parsed.JWT_SECRET;

exports.userJwt = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const data = jwt.verify(token, env.parsed.JWT_SECRET);
    req.user = data; // store the decoded user data in the request object
    next(); // continue with the next middleware or route
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).send("Token has expired");
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).send("Invalid token");
    } else {
      return res.status(500).send("Internal server error");
    }
  }
};
