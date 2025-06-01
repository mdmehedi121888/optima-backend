const { connection2 } = require("../config/db");

class ScrapReason {
  static async getAll() {
    const result = await connection2.query(
      "SELECT * FROM `optima_scrap_reasons_setup` WHERE is_active = 1"
    );
    return result;
  }

  static async create(scrapReasonData) {
    const { scrapReason, scrapGroup, stations, creator } = scrapReasonData;
    const result = await connection2.query(
      "INSERT INTO `optima_scrap_reasons_setup` (scrap_reason, scrap_group, stations, creator) VALUES (?, ?, ?, ?)",
      [scrapReason, scrapGroup, stations, creator]
    );
    return result;
  }

  static async update(id, updateData) {
    const { scrapReason, scrapGroup, stations, creator } = updateData;
    const result = await connection2.query(
      "UPDATE optima_scrap_reasons_setup SET scrap_reason = ?, scrap_group = ?, stations = ?, creator = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND is_active = 1",
      [scrapReason, scrapGroup, stations, creator, id]
    );
    return result;
  }

  static async delete(id) {
    const result = await connection2.query(
      "UPDATE optima_scrap_reasons_setup SET is_active = 0 WHERE id = ? AND is_active = 1",
      [id]
    );
    return result;
  }
}

module.exports = ScrapReason;
