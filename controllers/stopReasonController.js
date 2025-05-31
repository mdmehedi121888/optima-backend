const StopReason = require("../models/stopReason");

const getStopReasons = async (req, res) => {
  try {
    const reasons = await StopReason.getAll();
    res.json(reasons);
  } catch (err) {
    console.error("Error fetching stop reasons:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createStopReason = async (req, res) => {
  try {
    await StopReason.create(req.body);
    res.json({ success: true, message: "Stop Reason added successfully" });
  } catch (err) {
    console.error("Error creating stop reason:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateStopReason = async (req, res) => {
  try {
    const result = await StopReason.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "stop reason not found or inactive" });
    }
    res.json({ success: true, message: "stop reason updated successfully" });
  } catch (err) {
    console.error("Error updating stop reason:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteStopReason = async (req, res) => {
  try {
    const result = await StopReason.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "stop reason not found or inactive" });
    }
    res.json({ success: true, message: "stop reason Deleted Successfully" });
  } catch (err) {
    console.error("Error deleting stop reason:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getStopReasons,
  createStopReason,
  updateStopReason,
  deleteStopReason,
};
