const jwt = require("jsonwebtoken");
const { JWT_SECRET, userJwt } = require("../config/jwtConfig");

exports.authUser = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Missing JWT token" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid JWT token" });
    }
    req.user = decoded; // Add decoded user to request object for later use
    next();
  });
};

exports.sameId = (req, res, next) => {
  const { userId } = req.user; // Retrieve user ID from decoded token in request object
  const { id } = req.params;
  if (id !== userId) {
    return res.status(403).json({
      message: "You can only modify your own user data",
    });
  }
  next();
};

exports.adminOnly = (req, res, next) => {
  const { isAdmin } = req.user; // Retrieve isAdmin flag from decoded token in request object
  if (!isAdmin) {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};

exports.businessOnly = (req, res, next) => {
  const { isBusiness } = req.user; // Retrieve isBusiness flag from decoded token in request object
  if (!isBusiness) {
    return res.status(403).json({ message: "Business users only" });
  }
  next();
};

exports.sameIdOrAdmin = (req, res, next) => {
  const { userId, isAdmin } = req.user; // Retrieve user ID and isAdmin flag from decoded token in request object
  const { id } = req.params;
  if (id !== userId && !isAdmin) {
    return res.status(403).json({
      message: "You can only modify your own user data or must be an admin",
    });
  }
  next();
};
