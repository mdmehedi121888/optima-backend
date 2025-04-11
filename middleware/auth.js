const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized, please log in" });
};

module.exports = { isAuthenticated };
