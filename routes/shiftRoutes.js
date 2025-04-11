const express = require("express");
const router = express.Router();
const {
  getShifts,
  getSpecificShifts,
  createShift,
  updateShift,
  deleteShift,
} = require("../controllers/shiftController");

router.get("/", getShifts);
router.get("/specific", getSpecificShifts);
router.post("/", createShift);
router.put("/:id", updateShift);
router.delete("/:id", deleteShift);

module.exports = router;
