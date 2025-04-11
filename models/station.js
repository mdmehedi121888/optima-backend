const { connection2 } = require("../config/db");

class Station {
  static async getAll() {
    const result = await connection2.query(
      "SELECT * FROM `optima_stations_tbl` WHERE is_active = 1"
    );
    return result;
  }

  static async create(stationData) {
    const {
      stations,
      stationsGroup,
      requireOperator,
      emptyShiftReason,
      unhappyOee,
      happyOee,
    } = stationData;
    const result = await connection2.query(
      "INSERT INTO `optima_stations_tbl` (stations, stationsGroup, requireOperator, emptyShiftReason, unhappyOee, happyOee) VALUES (?, ?, ?, ?, ?, ?)",
      [
        stations,
        stationsGroup,
        requireOperator,
        emptyShiftReason,
        unhappyOee,
        happyOee,
      ]
    );
    return result;
  }

  static async update(id, updateData) {
    const {
      stations,
      stationsGroup,
      requireOperator,
      emptyShiftReason,
      unhappyOee,
      happyOee,
    } = updateData;
    const result = await connection2.query(
      "UPDATE optima_stations_tbl SET stations = ?, stationsGroup = ?, requireOperator = ?, emptyShiftReason = ?, unhappyOee = ?, happyOee = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND is_active = 1",
      [
        stations,
        stationsGroup,
        requireOperator,
        emptyShiftReason,
        unhappyOee,
        happyOee,
        id,
      ]
    );
    return result;
  }

  static async delete(id) {
    const result = await connection2.query(
      "UPDATE optima_stations_tbl SET is_active = 0 WHERE id = ? AND is_active = 1",
      [id]
    );
    return result;
  }
}

module.exports = Station;
