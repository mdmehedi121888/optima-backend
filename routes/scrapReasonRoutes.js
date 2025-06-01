const express = require("express");
const router = express.Router();
const {
  getScrapReasons,
  createScrapReason,
  updateScrapReason,
  deleteScrapReason,
} = require("../controllers/scrapReasonController");

router.get("/", getScrapReasons);
router.post("/", createScrapReason);
router.put("/:id", updateScrapReason);
router.delete("/:id", deleteScrapReason);

module.exports = router;
