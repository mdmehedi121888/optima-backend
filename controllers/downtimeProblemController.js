const DowntimeProblem = require("../models/downtimeProblem");

const getProblemGroup = async (req, res) => {
  try {
    const problems = await DowntimeProblem.getAll();
    res.json(problems);
  } catch (err) {
    console.error("Error fetching problem groups:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSpecificProblems = async (req, res) => {
  try {
    const { problem } = req.query;

    // Validate input
    if (!problem) {
      return res.status(400).json({
        error: "Missing required parameters: problem is required",
      });
    }

    const problemGroup = { problem };
    const problems = await DowntimeProblem.getSpecificAll(problemGroup);
    res.json(problems);
  } catch (err) {
    console.error("Error fetching problems:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message, // This will show the specific error message
    });
  }
};

const createDowntimeRecords = async (req, res) => {
  try {
    await DowntimeProblem.createDowntimeRecords(req.body);
    res.json({ success: true, message: "Downtime Problem saved successfully" });
  } catch (err) {
    console.error("Error saved Downtime Problem:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSpecificDowntimeRecords = async (req, res) => {
  try {
    const { station, shift } = req.query;

    // Validate input
    if (!station || !shift) {
      return res.status(400).json({
        error: "Missing required parameters: stations and shifts are required",
      });
    }

    const requiredData = { station, shift };
    const downtimeData = await DowntimeProblem.getSpecificDowntimeRecords(
      requiredData
    );
    res.json(downtimeData);
  } catch (err) {
    console.error("Error fetching downtime data:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message, // This will show the specific error message
    });
  }
};

const getAllDowntimeRecords = async (req, res) => {
  try {
    const problems = await DowntimeProblem.getAllDowntimeRecords();
    res.json(problems);
  } catch (err) {
    console.error("Error fetching problem records:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  getProblemGroup,
  getSpecificProblems,
  createDowntimeRecords,
  getSpecificDowntimeRecords,
  getAllDowntimeRecords,
};
