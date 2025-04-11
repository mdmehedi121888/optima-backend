const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");
const {
  getOperators,
  createOperator,
  updateOperator,
  deleteOperator,
  getSpecificOperators,
} = require("../controllers/operatorController");

router.get("/", isAuthenticated, getOperators);
router.get("/specific", getSpecificOperators);
router.post("/", createOperator);
router.put("/:id", updateOperator);
router.delete("/:id", deleteOperator);

module.exports = router;
