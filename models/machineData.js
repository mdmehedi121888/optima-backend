const { connection } = require("../config/db");

class MachineData {
  static async fetchData(machineData) {
    const { line, startTime, endTime } = machineData;
    try {
      // console.log("Received machine data:", { line, startTime, endTime });

      const lineColumnMap = {
        "Final Line": "final_line_diff",
        "Internal Line": "internal_line_diff",
        "External Line": "external_line_diff",
      };

      const column = lineColumnMap[line];

      // Get current date in Asia/Dhaka timezone
      const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const [{ value: year }, , { value: month }, , { value: day }] =
        formatter.formatToParts(new Date());
      const today = `${year}-${month}-${day}`;

      const startTimestamp = `${today} ${startTime}:00`;
      const endTimestamp = `${today} ${endTime}:00`;

      const query = `
        SELECT ${column}, timestamp 
        FROM optima_machine_data_entry 
        WHERE timestamp >= ? AND timestamp <= ? 
        ORDER BY id DESC
      `;

      const queryParams = [startTimestamp, endTimestamp];
      // console.log("Executing query:", query, "with params:", queryParams);

      const result = await connection.query(query, queryParams);
      // Ensure timestamps in result are in Asia/Dhaka
      const adjustedResult = result.map((row) => ({
        ...row,
        timestamp: new Date(row.timestamp)
          .toLocaleString("en-US", {
            timeZone: "Asia/Dhaka",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })
          .replace(/,/, ""),
      }));
      return adjustedResult;
    } catch (error) {
      console.error("Error querying machine data:", error);
      throw error;
    }
  }
}

module.exports = MachineData;
