const { connection2 } = require("../config/db");

class Shift {
  static async getAll() {
    const result = await connection2.query("SELECT * FROM `optima_shifts_tbl`");
    return result;
  }

  static async getSpecificAll(shiftData) {
    try {
      const { stations, days } = shiftData;
      const result = await connection2.query(
        "SELECT * FROM optima_shifts_tbl WHERE stations LIKE CONCAT('%', ?, '%') AND days LIKE CONCAT('%', ?, '%') AND is_active = 1 GROUP BY shiftName",
        [stations, days]
      );
      return result;
    } catch (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }
  }

  static async create(shiftData) {
    const { shiftName, startTime, endTime, stations, days, creator } =
      shiftData;
    const result = await connection2.query(
      "INSERT INTO `optima_shifts_tbl` (shiftName, startTime, endTime, stations, days, creator) VALUES (?, ?, ?, ?, ?, ?)",
      [shiftName, startTime, endTime, stations, days, creator]
    );
    return result;
  }

  static async update(id, updateData) {
    const { shiftName, startTime, endTime, stations, days, creator } =
      updateData;
    const result = await connection2.query(
      "UPDATE optima_shifts_tbl SET shiftName = ?, startTime = ?, endTime = ?, stations = ?, days = ?, creator = ?, is_active = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [shiftName, startTime, endTime, stations, days, creator, id]
    );
    return result;
  }

  static async delete(id) {
    const result = await connection2.query(
      "UPDATE optima_shifts_tbl SET is_active = 0 WHERE id = ? AND is_active = 1",
      [id]
    );
    return result;
  }
}

module.exports = Shift;
