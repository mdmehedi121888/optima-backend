const { connection2 } = require("../config/db");

class SpeedLossReason {
  static async getAll() {
    const result = await connection2.query(
      "SELECT * FROM `optima_speed_loss_reasons_setup` WHERE is_active = 1"
    );
    return result;
  }

  static async getSpeedLossRecords(requiredData) {
    const date = new Date();
    const currentDate = date.toISOString().slice(0, 10); // Format: YYYY-MM-DD
    try {
      const { station, shift } = requiredData;
      const result = await connection2.query(
        "SELECT * FROM optima_speed_loss_tracking_tbl WHERE station = ? AND shift = ? AND production_date = ? AND is_active = 1",
        [station, shift, currentDate]
      );
      return result;
    } catch (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }
  }

  static async getAllSpeedLossRecords(requiredData) {
    try {
      const result = await connection2.query(
        "SELECT * FROM optima_speed_loss_tracking_tbl WHERE is_active = 1"
      );
      return result;
    } catch (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }
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

  static async createSpeedLossRecords(speedLossReasonData) {
    const {
      startTime,
      endTime,
      speedLossReason,
      station,
      location,
      productionDate,
      shift,
      creator,
    } = speedLossReasonData;
    const result = await connection2.query(
      "INSERT INTO `optima_speed_loss_tracking_tbl` ( `start_time`, `end_time`, `speed_loss_reason`, `station`, `location`, `production_date`, `shift`, `creator`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        startTime,
        endTime,
        speedLossReason,
        station,
        location,
        productionDate,
        shift,
        creator,
      ]
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

  static async updateSpeedLossRecords(id, updateData) {
    const {
      startTime,
      endTime,
      speedLossReason,
      station,
      location,
      productionDate,
      shift,
      creator,
    } = updateData;
    const result = await connection2.query(
      "UPDATE optima_speed_loss_tracking_tbl SET start_time = ?, end_time = ?, speed_loss_reason = ?, station = ?, location = ?, production_date = ?, shift = ?, creator = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND is_active = 1",
      [
        startTime,
        endTime,
        speedLossReason,
        station,
        location,
        productionDate,
        shift,
        creator,
        id,
      ]
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

  static async deleteSpeedLossRecords(id) {
    const result = await connection2.query(
      "UPDATE optima_speed_loss_tracking_tbl SET is_active = 0 WHERE id = ? AND is_active = 1",
      [id]
    );
    return result;
  }
}

module.exports = SpeedLossReason;
