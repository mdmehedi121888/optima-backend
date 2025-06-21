const express = require("express");
const router = express.Router();
const { getStationsStatus } = require("../controllers/stationStatusController");

router.get("/", getStationsStatus);

module.exports = router;
