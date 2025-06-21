const StationStatus = require("../models/stationStatus");

const getStationsStatus = async (req, res) => {
  try {
    const stations = await StationStatus.get();
    res.json(stations);
  } catch (err) {
    console.error("Error fetching stations:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getStationsStatus };
