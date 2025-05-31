const { connection2 } = require("../config/db");

class StopReason {
  static async getAll() {
    const result = await connection2.query(
      "SELECT * FROM `optima_problem_criteria_setup` WHERE is_active = 1"
    );
    return result;
  }

  static async create(stopReasonData) {
    const {
      problemGroups,
      problemReasons,
      stopTypes,
      oeeCalculation,
      stations,
      creator,
    } = stopReasonData;
    const result = await connection2.query(
      "INSERT INTO `optima_problem_criteria_setup` (problem_groups, problem_reasons, stop_types, oee_calculation, stations, creator) VALUES (?, ?, ?, ?, ?, ?)",
      [
        problemGroups,
        problemReasons,
        stopTypes,
        oeeCalculation,
        stations,
        creator,
      ]
    );
    return result;
  }

  static async update(id, updateData) {
    const {
      problemGroups,
      problemReasons,
      stopTypes,
      oeeCalculation,
      stations,
      creator,
    } = updateData;
    const result = await connection2.query(
      "UPDATE optima_problem_criteria_setup SET problem_groups = ?, problem_reasons = ?, stop_types = ?, oee_calculation = ?, stations = ?, creator = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND is_active = 1",
      [
        problemGroups,
        problemReasons,
        stopTypes,
        oeeCalculation,
        stations,
        creator,
        id,
      ]
    );
    return result;
  }

  static async delete(id) {
    const result = await connection2.query(
      "UPDATE optima_problem_criteria_setup SET is_active = 0 WHERE id = ? AND is_active = 1",
      [id]
    );
    return result;
  }
}

module.exports = StopReason;
