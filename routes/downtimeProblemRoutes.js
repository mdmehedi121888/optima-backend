const express = require("express");
const router = express.Router();
const {
  getProblemGroup,
  getSpecificProblems,
  createDowntimeRecords,
  getSpecificDowntimeRecords,
  getAllDowntimeRecords,
} = require("../controllers/downtimeProblemController");

router.get("/", getProblemGroup);
router.get("/specific", getSpecificProblems);
router.get("/specificDowntimeRecords", getSpecificDowntimeRecords);
router.get("/getAllDowntimeRecords", getAllDowntimeRecords);
router.post("/create", createDowntimeRecords);

module.exports = router;
