const express = require("express");
const router = express.Router();
const {
  getStopReasons,
  createStopReason,
  updateStopReason,
  deleteStopReason,
} = require("../controllers/stopReasonController");

router.get("/", getStopReasons);
router.post("/", createStopReason);
router.put("/:id", updateStopReason);
router.delete("/:id", deleteStopReason);

module.exports = router;
