const express = require("express");
const router = express.Router();
const {
  getSpeedLossReasons,
  createSpeedLossReason,
  updateSpeedLossReason,
  deleteSpeedLossReason,
} = require("../controllers/speedLossReasonController");

router.get("/", getSpeedLossReasons);
router.post("/", createSpeedLossReason);
router.put("/:id", updateSpeedLossReason);
router.delete("/:id", deleteSpeedLossReason);

module.exports = router;
