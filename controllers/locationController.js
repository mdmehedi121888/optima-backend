const Location = require("../models/location");

const getLocations = async (req, res) => {
  try {
    const locations = await Location.getAll();
    res.json(locations);
  } catch (err) {
    console.error("Error fetching locations:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createLocation = async (req, res) => {
  try {
    await Location.create(req.body);
    res.json({
      success: true,
      message: "location added successfully",
    });
  } catch (err) {
    console.error("Error creating locations:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateLocation = async (req, res) => {
  try {
    const result = await Location.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "location not found or inactive" });
    }
    res.json({
      success: true,
      message: "location updated successfully",
    });
  } catch (err) {
    console.error("Error updating location:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteLocation = async (req, res) => {
  try {
    const result = await Location.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "location not found or inactive" });
    }
    res.json({
      success: true,
      message: "location Deleted Successfully",
    });
  } catch (err) {
    console.error("Error deleting location:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
};
