const express = require("express");
const router = express.Router();
const {
  saveOEEMetrics,
  getOEEMetricsByDate,
  getOEEMetricsByAll,
} = require("../controllers/oeeMetricsController");

// Save OEE metrics (create or update)
router.post("/post", saveOEEMetrics);

// Get OEE metrics by date
router.get("/get/by-date", getOEEMetricsByDate);

// Get all OEE metrics data
router.get("/getAll", getOEEMetricsByAll);

module.exports = router;
