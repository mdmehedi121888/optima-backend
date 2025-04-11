const Operator = require("../models/operator");

const getOperators = async (req, res) => {
  try {
    const operators = await Operator.getAll();
    res.json(operators);
  } catch (err) {
    console.error("Error fetching operators:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createOperator = async (req, res) => {
  try {
    await Operator.create(req.body);
    res.json({ success: true, message: "Operator added successfully" });
  } catch (err) {
    console.error("Error creating operator:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateOperator = async (req, res) => {
  try {
    const result = await Operator.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Operator not found or inactive" });
    }
    res.json({ success: true, message: "Operator updated successfully" });
  } catch (err) {
    console.error("Error updating operator:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteOperator = async (req, res) => {
  try {
    const result = await Operator.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Operator not found or inactive" });
    }
    res.json({ success: true, message: "Operator Deleted Successfully" });
  } catch (err) {
    console.error("Error deleting operator:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSpecificOperators = async (req, res) => {
  try {
    const { stations, shift } = req.query;

    // Validate input
    if (!stations || !shift) {
      return res.status(400).json({
        error: "Missing required parameters: stations and shifts are required",
      });
    }

    const operatorData = { stations, shift };
    const operators = await Operator.getSpecificAll(operatorData);
    res.json(operators);
  } catch (err) {
    console.error("Error fetching operators:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message, // This will show the specific error message
    });
  }
};
module.exports = {
  getOperators,
  createOperator,
  updateOperator,
  deleteOperator,
  getSpecificOperators,
};
