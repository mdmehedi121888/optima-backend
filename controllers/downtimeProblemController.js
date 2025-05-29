const DowntimeProblem = require("../models/downtimeProblem");

const getProblemGroup = async (req, res) => {
  try {
    const problems = await DowntimeProblem.getAll();
    res.json(problems);
  } catch (err) {
    console.error("Error fetching problem groups:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

const getSpecificProblems = async (req, res) => {
  try {
    const { problem } = req.query;
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
      message: err.message,
    });
  }
};

const createDowntimeRecords = async (req, res) => {
  try {
    const {
      problem_group,
      problemReason,
      startTime,
      endTime,
      location,
      planned_status,
    } = req.body;
    if (
      !problem_group ||
      !problemReason ||
      !startTime ||
      !endTime ||
      !location ||
      !planned_status
    ) {
      return res.status(400).json({
        error:
          "Missing required fields: problem_group, problemReason, startTime, endTime, location, or planned_status",
      });
    }
    await DowntimeProblem.createDowntimeRecords(req.body);
    res.json({ success: true, message: "Downtime Problem saved successfully" });
  } catch (err) {
    console.error("Error saving Downtime Problem:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

const getSpecificDowntimeRecords = async (req, res) => {
  try {
    const { station, shift } = req.query;
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
      message: err.message,
    });
  }
};

const getSpecificDowntimeRecordsByDate = async (req, res) => {
  try {
    const { station, shift, date } = req.query;
    if (!station || !shift || !date) {
      return res.status(400).json({
        error:
          "Missing required parameters: stations, shifts and date are required",
      });
    }
    const requiredData = { station, shift, date };
    const downtimeData = await DowntimeProblem.getSpecificDowntimeRecordsByDate(
      requiredData
    );
    res.json(downtimeData);
  } catch (err) {
    console.error("Error fetching downtime data:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
};

const getAllDowntimeRecords = async (req, res) => {
  try {
    const problems = await DowntimeProblem.getAllDowntimeRecords();
    res.json(problems);
  } catch (err) {
    console.error("Error fetching problem records:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

const updateDowntimeRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      startTime,
      endTime,
      problem_group,
      problem_name,
      location,
      planned_status,
    } = req.body;
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid or missing id" });
    }
    if (
      !startTime ||
      !endTime ||
      !problem_group ||
      !problem_name ||
      !location ||
      !planned_status
    ) {
      return res.status(400).json({
        message:
          "Missing required fields: startTime, endTime, problem_group, problem_name, location, or planned_status",
      });
    }
    const result = await DowntimeProblem.updateDowntimeRecord(id, req.body);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Downtime record not found or no changes made" });
    }
    res.json({
      success: true,
      message: "Downtime Problem updated successfully",
    });
  } catch (err) {
    console.error("Error updating Downtime Problem:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};
const deleteDowntimeRecord = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid or missing id" });
    }

    const result = await DowntimeProblem.deleteDowntimeRecord(id);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Downtime record not found or no changes made" });
    }
    res.json({
      success: true,
      message: "Downtime Problem delete successfully",
    });
  } catch (err) {
    console.error("Error deleting Downtime Problem:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

module.exports = {
  getProblemGroup,
  getSpecificProblems,
  createDowntimeRecords,
  getSpecificDowntimeRecords,
  getAllDowntimeRecords,
  getSpecificDowntimeRecordsByDate,
  updateDowntimeRecord,
  deleteDowntimeRecord,
};
