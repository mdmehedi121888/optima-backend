// machineData.js
const { connection } = require("../config/db");

class MachineData {
  static async fetchData(machineData) {
    const { line, startTime, endTime } = machineData;
    try {
      // console.log("Received machine data:", { line, startTime, endTime });

      const lineColumnMap = {
        "Final Line": "final_line",
        "Internal Line": "internal_line",
        "External Line": "external_line",
      };

      const column = lineColumnMap[line] || "final_line";
      const today = new Date().toISOString().split("T")[0];

      const startTimestamp = `${today} ${startTime || "00:00"}:00`;
      const endTimestamp = `${today} ${endTime || "23:59"}:00`;

      const query = `
        SELECT ${column}, timestamp 
        FROM optima_machine_data_entry 
        WHERE timestamp >= ? AND timestamp <= ? 
        ORDER BY id DESC
      `;

      const queryParams = [startTimestamp, endTimestamp];
      // console.log("Executing query:", query, "with params:", queryParams);

      const result = await connection.query(query, queryParams);
      return result;
    } catch (error) {
      console.error("Error querying machine data:", error);
      throw error;
    }
  }
}

module.exports = MachineData;
