const ScrapReason = require("../models/scrapReason");

const getScrapReasons = async (req, res) => {
  try {
    const reasons = await ScrapReason.getAll();
    res.json(reasons);
  } catch (err) {
    console.error("Error fetching scrap reasons:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createScrapReason = async (req, res) => {
  try {
    await ScrapReason.create(req.body);
    res.json({
      success: true,
      message: "scrap Reason added successfully",
    });
  } catch (err) {
    console.error("Error creating scrap reason:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateScrapReason = async (req, res) => {
  try {
    const result = await ScrapReason.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "scrap reason not found or inactive" });
    }
    res.json({
      success: true,
      message: "scrap reason updated successfully",
    });
  } catch (err) {
    console.error("Error updating scrap reason:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteScrapReason = async (req, res) => {
  try {
    const result = await ScrapReason.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "scrap reason not found or inactive" });
    }
    res.json({
      success: true,
      message: "scrap reason Deleted Successfully",
    });
  } catch (err) {
    console.error("Error deleting scrap reason:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getScrapReasons,
  createScrapReason,
  updateScrapReason,
  deleteScrapReason,
};
