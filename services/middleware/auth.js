
// Middleware to check if the user is logged in
exports.isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login'); // Redirect to login if not authenticated
  }
  next();
};

// Middleware to authorize specific roles
exports.authorizeRole = (...roles) => (req, res, next) => {
  // Check if the user is logged in and has a role
  if (!req.session.user || !req.session.user.role) {
    return res.status(401).send("Unauthorized: Please log in.");
  }

  const userRole = req.session.user.role.toLowerCase(); // Normalize to lowercase for comparison
  const allowedRoles = roles.map((role) => role.toLowerCase()); // Normalize input roles to lowercase

  console.log("User Role from Session:", userRole); // Debug log
  console.log("Allowed Roles:", allowedRoles); // Debug log

  // Check if the user's role is included in the allowed roles
  if (!allowedRoles.includes(userRole)) {
    return res.status(403).send("Access denied. You do not have permission to perform this action.");
  }

  next(); // User is authorized, proceed to the next middleware/controller
};



