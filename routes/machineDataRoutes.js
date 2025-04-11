const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");
const { getMachineData } = require("../controllers/machineDataController");

router.post("/", getMachineData);

module.exports = router;
