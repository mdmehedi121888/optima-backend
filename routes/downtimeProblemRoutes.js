const express = require("express");
const router = express.Router();
const {
  getProblemGroup,
  getSpecificProblems,
  createDowntimeRecords,
  getSpecificDowntimeRecords,
} = require("../controllers/downtimeProblemController");

router.get("/", getProblemGroup);
router.get("/specific", getSpecificProblems);
router.get("/specificDowntimeRecords", getSpecificDowntimeRecords);
router.post("/create", createDowntimeRecords);

module.exports = router;
