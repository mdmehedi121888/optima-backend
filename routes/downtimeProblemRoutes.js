const express = require("express");
const router = express.Router();
const {
  getProblemGroup,
  getSpecificProblems,
  createDowntimeRecords,
  getSpecificDowntimeRecords,
  getAllDowntimeRecords,
  getSpecificDowntimeRecordsByDate,
  updateDowntimeRecord,
  deleteDowntimeRecord,
} = require("../controllers/downtimeProblemController");

router.get("/", getProblemGroup);
router.get("/specific", getSpecificProblems);
router.get("/specificDowntimeRecords", getSpecificDowntimeRecords);
router.get(
  "/getSpecificDowntimeRecordsByDate",
  getSpecificDowntimeRecordsByDate
);
router.get("/getAllDowntimeRecords", getAllDowntimeRecords);
router.post("/create", createDowntimeRecords);
router.put("/update/:id", updateDowntimeRecord);
router.delete("/delete/:id", deleteDowntimeRecord);

module.exports = router;
