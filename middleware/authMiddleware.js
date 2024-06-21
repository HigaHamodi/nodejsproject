const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwtConfig");

exports.authUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "User Not Authorized" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "User Not Authorized" });
    } else {
      req.user = decoded;
      next();
    }
  });
};

exports.sameId = (req, res, next) => {
  const { userId } = req.user;
  const { id } = req.params;
  if (id != userId) {
    return res.status(401).json({
      message: "You can't change that user, you can change only your user",
    });
  }
  next();
};

exports.adminOnly = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(401).json({ message: "Access denied. Admins only" });
  }
  next();
};

exports.businessOnly = (req, res, next) => {
  if (!req.user.IsBusiness && !req.user.isAdmin) {
    return res.status(401).json({ message: "Access denied. Business only" });
  }
  next();
};

exports.sameIdOrAdmin = (req, res, next) => {
  const { userId, isAdmin } = req.user;
  const { id } = req.params;
  if (id != userId && !isAdmin) {
    return res.status(401).json({ message: "User Not Authorized" });
  }
  next();
};
