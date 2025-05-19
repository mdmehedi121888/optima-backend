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
      cycleTime,
      unitsPerSensorSignal,
      startTime,
      endTime,
      location,
      problemReason,
      planned_status,
      shift,
    } = problemData;
    const result = await connection2.query(
      "INSERT INTO `optima_downtime_tracking_tbl` (productName, productCode, productGroup, station, productionDate, shift, cycleTime, unitsPerSensorSignal, problem_name,  startTime, endTime, location, planned_status) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        productName,
        productCode,
        productGroup,
        station,
        productionDate,
        shift,
        cycleTime,
        unitsPerSensorSignal,
        problemReason,
        startTime,
        endTime,
        location,
        planned_status,
      ]
    );
    return result;
  }

  static async getSpecificDowntimeRecords(requiredData) {
    const date = new Date();
    const currentDate = date.toISOString().slice(0, 10); // Format: YYYY-MM-DD
    try {
      const { station, shift } = requiredData;
      const result = await connection2.query(
        "SELECT * FROM optima_downtime_tracking_tbl WHERE station =? AND shift = ? AND productionDate = ? AND is_active = 1",
        [station, shift, currentDate]
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
