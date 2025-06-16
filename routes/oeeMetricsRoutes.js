const express = require("express");
const router = express.Router();
const {
  saveOEEMetrics,
  getOEEMetricsByDate,
} = require("../controllers/oeeMetricsController");

// Save OEE metrics (create or update)
router.post("/post", saveOEEMetrics);

// Get OEE metrics by date (default shift)
router.get("/get/by-date", getOEEMetricsByDate);

module.exports = router;
