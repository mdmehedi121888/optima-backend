const { connection2 } = require("../config/db");

class Operator {
  static async getAll() {
    const result = await connection2.query(
      "SELECT * FROM `optima_operators_tbl` WHERE is_active = 1"
    );
    return result;
  }

  static async create(operatorData) {
    const { userId, password, userName, userImage, stations, shift } =
      operatorData;
    const result = await connection2.query(
      "INSERT INTO `optima_operators_tbl` (userId, password, userName, userImage, stations, shift) VALUES (?, ?, ?, ?, ?, ?)",
      [userId, password, userName, userImage, stations, shift]
    );
    return result;
  }

  static async update(id, updateData) {
    const { password, stations, shift } = updateData;
    const result = await connection2.query(
      "UPDATE optima_operators_tbl SET password = ?, stations = ?, shift = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND is_active = 1",
      [password, stations, shift, id]
    );
    return result;
  }

  static async delete(id) {
    const result = await connection2.query(
      "UPDATE optima_operators_tbl SET is_active = 0 WHERE id = ? AND is_active = 1",
      [id]
    );
    return result;
  }

  static async getSpecificAll(operatorData) {
    try {
      const { stations, shift } = operatorData;
      const result = await connection2.query(
        "SELECT * FROM optima_operators_tbl WHERE stations LIKE CONCAT('%', ?, '%') AND shift = ? AND is_active = 1",
        [stations, shift]
      );
      return result;
    } catch (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }
  }
}

module.exports = Operator;
