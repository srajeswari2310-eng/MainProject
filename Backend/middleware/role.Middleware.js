// Role-based authorization middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Skip role check if auth is disabled
    if (!!process.env.IS_AUTH) return next();

    // Ensure user and role exist
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized: no user role" });
    }

    // Check if user's role is allowed
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: insufficient role" });
    }

    // Role is authorized
    next();
  };
};

module.exports = authorizeRoles;
