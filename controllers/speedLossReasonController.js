const SpeedLossReason = require("../models/speedLossReason");

const getSpeedLossReasons = async (req, res) => {
  try {
    const reasons = await SpeedLossReason.getAll();
    res.json(reasons);
  } catch (err) {
    console.error("Error fetching speed loss reasons:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createSpeedLossReason = async (req, res) => {
  try {
    await SpeedLossReason.create(req.body);
    res.json({
      success: true,
      message: "Speed Loss Reason added successfully",
    });
  } catch (err) {
    console.error("Error creating speed loss reason:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateSpeedLossReason = async (req, res) => {
  try {
    const result = await SpeedLossReason.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "speed loss reason not found or inactive" });
    }
    res.json({
      success: true,
      message: "speed loss reason updated successfully",
    });
  } catch (err) {
    console.error("Error updating speed loss reason:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteSpeedLossReason = async (req, res) => {
  try {
    const result = await SpeedLossReason.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "speed loss reason not found or inactive" });
    }
    res.json({
      success: true,
      message: "speed loss reason Deleted Successfully",
    });
  } catch (err) {
    console.error("Error deleting speed loss reason:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getSpeedLossReasons,
  createSpeedLossReason,
  updateSpeedLossReason,
  deleteSpeedLossReason,
};
