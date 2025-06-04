const express = require("express");
const router = express.Router();
const {
  getScrapReasons,
  getScrapRecordsByDate,
  createScrapReason,
  createScrapRecordsController,
  updateScrapReason,
  updateScrapRecordsController,
  deleteScrapReason,
  deleteScrapReasonByDate,
} = require("../controllers/scrapReasonController");

router.get("/", getScrapReasons);
router.get("/scrap", getScrapRecordsByDate);
router.post("/", createScrapReason);
router.post("/scrap", createScrapRecordsController);
router.put("/:id", updateScrapReason);
router.put("/scrap/:id", updateScrapRecordsController);
router.delete("/:id", deleteScrapReason);
router.delete("/scrap/:id", deleteScrapReasonByDate);

module.exports = router;
