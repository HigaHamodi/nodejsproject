const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/jwtConfig");

// Helper function to extract and verify JWT
const getTokenData = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "User Not Authorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const data = jwt.verify(token, JWT_SECRET);
    return data;
  } catch (err) {
    return res.status(401).json({ message: "User Not Authorized" });
  }
};

// Middleware to authenticate user
exports.authUser = (req, res, next) => {
  const tokenData = getTokenData(req, res);
  if (!tokenData) return;
  req.user = tokenData;
  next();
};

// Middleware to ensure the user is the same as the ID in the request
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

// Middleware to restrict access to admins only
exports.adminOnly = (req, res, next) => {
  const { isAdmin } = req.user;
  if (!isAdmin) {
    return res.status(401).json({ message: "Access denied. Admins only" });
  }
  next();
};

// Middleware to restrict access to business users only
exports.businessOnly = (req, res, next) => {
  const { IsBusiness } = req.user;
  if (!IsBusiness) {
    return res.status(401).json({ message: "Access denied. Business only" });
  }
  next();
};

// Middleware to ensure the user is the same as the ID in the request or an admin
exports.sameIdOrAdmin = (req, res, next) => {
  const { userId, isAdmin } = req.user;
  const { id } = req.params;
  if (id != userId && !isAdmin) {
    return res.status(401).json({ message: "User Not Authorized" });
  }
  next();
};

// Middleware to allow access to either admins or business users
exports.adminOrBusiness = (req, res, next) => {
  const { isAdmin, IsBusiness } = req.user;
  if (!isAdmin && !IsBusiness) {
    return res
      .status(401)
      .json({ message: "Access denied. Admin or Business users only" });
  }
  next();
};
