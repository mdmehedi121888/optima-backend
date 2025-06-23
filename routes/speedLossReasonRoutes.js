const express = require("express");
const router = express.Router();
const {
  getSpeedLossReasons,
  getSpeedLossRecords,
  getAllSpeedLossRecords,
  createSpeedLossReason,
  createSpeedLossRecords,
  updateSpeedLossReason,
  updateSpeedLossRecords,
  deleteSpeedLossReason,
  deleteSpeedLossRecords,
} = require("../controllers/speedLossReasonController");

router.get("/", getSpeedLossReasons);
router.get("/speedLossRecords", getSpeedLossRecords);
router.get("/allSpeedLossRecords", getAllSpeedLossRecords);
router.post("/", createSpeedLossReason);
router.post("/speedLossRecords", createSpeedLossRecords);
router.put("/:id", updateSpeedLossReason);
router.put("/speedLossRecords/:id", updateSpeedLossRecords);
router.delete("/:id", deleteSpeedLossReason);
router.delete("/speedLossRecords/:id", deleteSpeedLossRecords);

module.exports = router;
