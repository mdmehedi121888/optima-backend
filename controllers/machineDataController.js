// machineDataController.js
const MachineData = require("../models/machineData");

const getMachineData = async (req, res) => {
  try {
    // console.log("Controller received body:", req.body); // Debug log
    const data = await MachineData.fetchData(req.body); // Pass the entire payload
    res.json(data);
  } catch (err) {
    console.error("Error fetching machineData:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getMachineData };
