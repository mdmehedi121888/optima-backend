const { connection2 } = require("../config/db");

class User {
  static async findByUserId(userId, password) {
    const result = await connection2.query(
      "SELECT * FROM `optima_users_tbl` WHERE userId = ? AND password = ? AND is_active = 1",
      [userId, password]
    );
    if (!result[0]) {
      const result = await connection2.query(
        "SELECT * FROM `optima_operators_tbl` WHERE userId = ? AND password = ? AND is_active = 1",
        [userId, password]
      );
      // console.log(result[0]);
      return result[0];
    } else {
      // console.log(result[0]);
      return result[0];
    }
  }

  static async getAll() {
    const result = await connection2.query(
      "SELECT * FROM `optima_users_tbl` WHERE is_active = 1"
    );
    return result;
  }

  static async create(userData) {
    const { userId, userName, userImage, password, role, stations, creator } =
      userData;
    const result = await connection2.query(
      "INSERT INTO `optima_users_tbl` (userId, userName, userImage, password, role, stations, creator) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [userId, userName, userImage, password, role, stations, creator]
    );
    return result;
  }

  static async update(id, updateData) {
    const { password, role, stations, creator } = updateData;
    const result = await connection2.query(
      "UPDATE optima_users_tbl SET password = ?, role = ?, stations = ?, creator = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND is_active = 1",
      [password, role, stations, creator, id]
    );
    return result;
  }

  static async delete(id) {
    const result = await connection2.query(
      "UPDATE optima_users_tbl SET is_active = 0 WHERE id = ? AND is_active = 1",
      [id]
    );
    return result;
  }
}

module.exports = User;
