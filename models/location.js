const { connection2 } = require("../config/db");

class Location {
  static async getAll() {
    const result = await connection2.query(
      "SELECT * FROM `optima_locations_setup` WHERE is_active = 1"
    );
    return result;
  }

  static async create(locationData) {
    const { location, stations, creator } = locationData;
    const result = await connection2.query(
      "INSERT INTO `optima_locations_setup` (location, stations, creator) VALUES (?, ?, ?)",
      [location, stations, creator]
    );
    return result;
  }

  static async update(id, updateData) {
    const { location, stations, creator } = updateData;
    const result = await connection2.query(
      "UPDATE optima_locations_setup SET location = ?, stations = ?, creator = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND is_active = 1",
      [location, stations, creator, id]
    );
    return result;
  }

  static async delete(id) {
    const result = await connection2.query(
      "UPDATE optima_locations_setup SET is_active = 0 WHERE id = ? AND is_active = 1",
      [id]
    );
    return result;
  }
}

module.exports = Location;
