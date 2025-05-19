const express = require("express");
const router = express.Router();
const {
  login,
  logout,
  checkSession,
  checkAdmin,
  checkIncharge,
} = require("../controllers/authController");

router.post("/login", login);
router.post("/logout", logout);
router.get("/check-session", checkSession);
router.get("/check-admin", checkAdmin);
router.get("/check-incharge", checkIncharge);

module.exports = router;
