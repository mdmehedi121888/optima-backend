const { connection2 } = require("../config/db");

class DowntimeProblem {
  static async getAll() {
    const result = await connection2.query(
      "SELECT `problem_groups` FROM `optima_problem_criteria_setup` WHERE is_active = 1 GROUP BY problem_groups;"
    );
    return result;
  }

  static async getSpecificAll(problemGroup) {
    try {
      const { problem } = problemGroup;
      const result = await connection2.query(
        "SELECT `problem_reasons` FROM `optima_problem_criteria_setup` WHERE is_active = 1 AND problem_groups = ? GROUP BY problem_reasons;",
        [problem]
      );
      return result;
    } catch (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }
  }

  static async createDowntimeRecords(problemData) {
    const {
      productName,
      productCode,
      productGroup,
      station,
      productionDate,
      shift,
      cycleTime,
      unitsPerSensorSignal,
      startTime,
      endTime,
      location,
      problem_group,
      problemReason,
      planned_status,
      creator,
    } = problemData;
    try {
      const result = await connection2.query(
        "INSERT INTO `optima_downtime_tracking_tbl` (productName, productCode, productGroup, station, productionDate, shift, cycleTime, unitsPerSensorSignal, problem_group, problem_name, startTime, endTime, location, planned_status, creator) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          productName,
          productCode,
          productGroup,
          station,
          productionDate,
          shift,
          cycleTime,
          unitsPerSensorSignal,
          problem_group,
          problemReason,
          startTime,
          endTime,
          location,
          planned_status,
          creator,
        ]
      );
      return result;
    } catch (error) {
      console.error("Error creating downtime record:", error);
      throw new Error(`Database insert failed: ${error.message}`);
    }
  }

  static async updateDowntimeRecord(id, problemData) {
    // console.log("id and problemData :", id, problemData);
    if (!id || isNaN(id)) {
      throw new Error("Invalid or missing id");
    }
    if (!problemData || typeof problemData !== "object") {
      throw new Error("Invalid or missing problem data");
    }

    const {
      startTime,
      endTime,
      problem_group,
      problemReason,
      location,
      planned_status,
    } = problemData;

    if (
      !startTime ||
      !endTime ||
      !problem_group ||
      !problemReason ||
      !location ||
      !planned_status
    ) {
      throw new Error(
        "Missing required fields: startTime, endTime, problem_group, problemReason, location, or planned_status"
      );
    }

    try {
      const result = await connection2.query(
        "UPDATE `optima_downtime_tracking_tbl` SET startTime = ?, endTime = ?, problem_group = ?, problem_name = ?, location = ?, planned_status = ? WHERE id = ? AND is_active = 1",
        [
          startTime,
          endTime,
          problem_group,
          problemReason,
          location,
          planned_status,
          parseInt(id),
        ]
      );
      // console.log("Update query result:", result);
      return result;
    } catch (error) {
      console.error("Database error details:", error);
      throw new Error(`Database update failed: ${error.message}`);
    }
  }

  static async deleteDowntimeRecord(id) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid or missing id");
    }

    try {
      const result = await connection2.query(
        "UPDATE `optima_downtime_tracking_tbl` SET is_active = 0 WHERE id = ?",
        [parseInt(id)]
      );
      return result;
    } catch (error) {
      console.error("Database error details:", error);
      throw new Error(`Database delete failed: ${error.message}`);
    }
  }

  static async getSpecificDowntimeRecords(requiredData) {
    const date = new Date();
    const currentDate = date.toISOString().slice(0, 10); // Format: YYYY-MM-DD
    try {
      const { station, shift } = requiredData;
      const result = await connection2.query(
        "SELECT * FROM optima_downtime_tracking_tbl WHERE station = ? AND shift = ? AND productionDate = ? AND is_active = 1",
        [station, shift, currentDate]
      );
      return result;
    } catch (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }
  }

  static async getSpecificDowntimeRecordsByDate(requiredData) {
    try {
      const { station, shift, date } = requiredData;
      const result = await connection2.query(
        "SELECT * FROM optima_downtime_tracking_tbl WHERE station = ? AND shift = ? AND productionDate = ? AND is_active = 1",
        [station, shift, date]
      );
      return result;
    } catch (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }
  }

  static async getAllDowntimeRecords() {
    const result = await connection2.query(
      "SELECT * FROM `optima_downtime_tracking_tbl` WHERE is_active = 1 order by id desc;"
    );
    return result;
  }
}

module.exports = DowntimeProblem;
