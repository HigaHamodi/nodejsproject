const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.JWT_SECRET = process.env.JWT_SECRET;

exports.userJwt = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: "User Not Authorized" });
    return null;
  }

  const token = authHeader.split(" ")[1];
  try {
    const data = jwt.verify(token, exports.JWT_SECRET);
    return data;
  } catch (err) {
    res.status(401).json({ message: "User Not Authorized" });
    return null;
  }
};
