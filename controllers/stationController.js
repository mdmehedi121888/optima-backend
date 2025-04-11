const Station = require("../models/station");

const getStations = async (req, res) => {
  try {
    const stations = await Station.getAll();
    res.json(stations);
  } catch (err) {
    console.error("Error fetching stations:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createStation = async (req, res) => {
  try {
    await Station.create(req.body);
    res.json({ success: true, message: "Station added successfully" });
  } catch (err) {
    console.error("Error creating station:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateStation = async (req, res) => {
  try {
    const result = await Station.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Station not found or inactive" });
    }
    res.json({ success: true, message: "Station updated successfully" });
  } catch (err) {
    console.error("Error updating station:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteStation = async (req, res) => {
  try {
    const result = await Station.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Station not found or inactive" });
    }
    res.json({ success: true, message: "Station Deleted Successfully" });
  } catch (err) {
    console.error("Error deleting station:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getStations, createStation, updateStation, deleteStation };
