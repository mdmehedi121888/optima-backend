const { connection2 } = require("../config/db");

class SpeedLossReason {
  static async getAll() {
    const result = await connection2.query(
      "SELECT * FROM `optima_speed_loss_reasons_setup` WHERE is_active = 1"
    );
    return result;
  }

  static async create(speedLossReasonData) {
    const { speedLossReason, speedLossGroup, stations, creator } =
      speedLossReasonData;
    const result = await connection2.query(
      "INSERT INTO `optima_speed_loss_reasons_setup` (speed_loss_reason, speed_loss_group, stations, creator) VALUES (?, ?, ?, ?)",
      [speedLossReason, speedLossGroup, stations, creator]
    );
    return result;
  }

  static async update(id, updateData) {
    const { speedLossReason, speedLossGroup, stations, creator } = updateData;
    const result = await connection2.query(
      "UPDATE optima_speed_loss_reasons_setup SET speed_loss_reason = ?, speed_loss_group = ?, stations = ?, creator = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND is_active = 1",
      [speedLossReason, speedLossGroup, stations, creator, id]
    );
    return result;
  }

  static async delete(id) {
    const result = await connection2.query(
      "UPDATE optima_speed_loss_reasons_setup SET is_active = 0 WHERE id = ? AND is_active = 1",
      [id]
    );
    return result;
  }
}

module.exports = SpeedLossReason;
