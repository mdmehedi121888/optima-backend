const Shift = require("../models/shift");

const getShifts = async (req, res) => {
  try {
    const shifts = await Shift.getAll();
    res.json(shifts);
  } catch (err) {
    console.error("Error fetching shifts:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSpecificShifts = async (req, res) => {
  try {
    const { stations, days } = req.query;

    // Validate input
    if (!stations || !days) {
      return res.status(400).json({
        error: "Missing required parameters: stations and days are required",
      });
    }

    const shiftData = { stations, days };
    const shifts = await Shift.getSpecificAll(shiftData);
    res.json(shifts);
  } catch (err) {
    console.error("Error fetching shifts:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message, // This will show the specific error message
    });
  }
};

const createShift = async (req, res) => {
  try {
    await Shift.create(req.body);
    res.json({ success: true, message: "Shift added successfully" });
  } catch (err) {
    console.error("Error creating shift:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateShift = async (req, res) => {
  try {
    const result = await Shift.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Shift not found or inactive" });
    }
    res.json({ success: true, message: "Shift updated successfully" });
  } catch (err) {
    console.error("Error updating shift:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteShift = async (req, res) => {
  try {
    const result = await Shift.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Shift not found or inactive" });
    }
    res.json({ success: true, message: "Shift Deleted Successfully" });
  } catch (err) {
    console.error("Error deleting shift:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getShifts,
  getSpecificShifts,
  createShift,
  updateShift,
  deleteShift,
};
