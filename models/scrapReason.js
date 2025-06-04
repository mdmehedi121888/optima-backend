const { connection2 } = require("../config/db");

class ScrapReason {
  static async getAll() {
    const result = await connection2.query(
      "SELECT * FROM `optima_scrap_reasons_setup` WHERE is_active = 1"
    );
    return result;
  }

  static async getSpecificScrapRecordsByDate(requiredData) {
    const date = new Date();
    const currentDate = date.toISOString().slice(0, 10); // Format: YYYY-MM-DD
    try {
      const { station, shift } = requiredData;
      const result = await connection2.query(
        "SELECT * FROM optima_scrap_tracking_tbl WHERE station = ? AND shift = ? AND production_date = ? AND is_active = 1",
        [station, shift, currentDate]
      );
      return result;
    } catch (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }
  }

  static async create(scrapReasonData) {
    const { scrapReason, scrapGroup, stations, creator } = scrapReasonData;
    const result = await connection2.query(
      "INSERT INTO `optima_scrap_reasons_setup` (scrap_reason, scrap_group, stations, creator) VALUES (?, ?, ?, ?)",
      [scrapReason, scrapGroup, stations, creator]
    );
    return result;
  }

  static async createScrapRecords(scrapReasonData) {
    const {
      startTime,
      endTime,
      scrapQty,
      scrapReason,
      station,
      location,
      productionDate,
      shift,
      creator,
    } = scrapReasonData;
    const result = await connection2.query(
      "INSERT INTO `optima_scrap_tracking_tbl` ( `start_time`, `end_time`,`scrap_qty`, `scrap_reason`, `station`, `location`, `production_date`, `shift`, `creator`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        startTime,
        endTime,
        scrapQty,
        scrapReason,
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
    const { scrapReason, scrapGroup, stations, creator } = updateData;
    const result = await connection2.query(
      "UPDATE optima_scrap_reasons_setup SET scrap_reason = ?, scrap_group = ?, stations = ?, creator = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND is_active = 1",
      [scrapReason, scrapGroup, stations, creator, id]
    );
    return result;
  }

  static async updateScrapRecords(id, updateData) {
    const {
      startTime,
      endTime,
      scrapQty,
      scrapReason,
      station,
      location,
      productionDate,
      shift,
      creator,
    } = updateData;
    const result = await connection2.query(
      "UPDATE optima_scrap_tracking_tbl SET start_time = ?, end_time = ?, scrap_qty = ?, scrap_reason = ?, station = ?, location = ?, production_date = ?, shift = ?, creator = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND is_active = 1",
      [
        startTime,
        endTime,
        scrapQty,
        scrapReason,
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
      "UPDATE optima_scrap_reasons_setup SET is_active = 0 WHERE id = ? AND is_active = 1",
      [id]
    );
    return result;
  }

  static async deleteScrapRecordsByDate(id) {
    const result = await connection2.query(
      "UPDATE optima_scrap_tracking_tbl SET is_active = 0 WHERE id = ? AND is_active = 1",
      [id]
    );
    return result;
  }
}

module.exports = ScrapReason;
