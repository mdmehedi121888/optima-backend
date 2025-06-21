const { connection } = require("../config/db");

class StationStatus {
  static async get() {
    const result = await connection.query(
      "SELECT MAX(final_line) - MIN(final_line) AS final_line_diff, MAX(internal_line) - MIN(internal_line) AS internal_line_diff, MAX(external_line) - MIN(external_line) AS external_line_diff, MAX(sys_date_time) AS last_timestamp FROM ( SELECT final_line, internal_line, external_line, sys_date_time FROM `optima_machine_data_entry` ORDER BY id DESC LIMIT 4 ) AS recent_data;"
    );
    return result;
  }
}

module.exports = StationStatus;
