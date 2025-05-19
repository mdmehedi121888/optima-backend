const User = require("../models/user");

const login = async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res
        .status(400)
        .json({ error: "User ID and password are required" });
    }

    const user = await User.findByUserId(userId, password);

    if (!user || user.password !== password) {
      return res.status(401).json({ error: "Invalid User ID or Password" });
    }

    req.session.user = {
      id: user.id,
      userId: user.userId,
      userName: user.userName,
      userImage: user.userImage,
      role: user.role,
      stations: user.stations,
    };

    res.status(200).json({
      success: true,
      message: "Logged in successful",
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.json({ success: true, message: "Logged out successfully" });
  });
};

const checkSession = (req, res) => {
  if (req.session.user) {
    res.json({ isAuthenticated: true, user: req.session.user });
  } else {
    res.json({ isAuthenticated: false });
  }
};

const checkAdmin = (req, res) => {
  if (req.session.user && req.session.user.role === "Super Admin") {
    res.json({
      isAuthenticated: true,
      user: req.session.user,
      role: req.session.user.role,
    });
  } else {
    res.json({ isAuthenticated: false });
  }
};
const checkIncharge = (req, res) => {
  if (
    req.session.user &&
    (req.session.user.role === "Incharge" ||
      req.session.user.role === "Super Admin")
  ) {
    res.json({
      isAuthenticated: true,
      user: req.session.user,
      role: req.session.user.role,
    });
  } else {
    res.json({ isAuthenticated: false });
  }
};

module.exports = { login, logout, checkSession, checkAdmin, checkIncharge };
