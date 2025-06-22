const { connection, connection2 } = require("../config/db");

class OEEMetrics {
  static async calculateHourlyMetrics({
    station,
    productionDate,
    shift,
    shiftStartTime,
    shiftEndTime,
  }) {
    const data = [];
    let totalPlannedTime = 0;
    let totalRunningTime = 0;
    let totalUnplannedDowntime = 0;
    let totalPlannedDowntime = 0;
    let totalProductionTime = 0;
    let totalActualProductionTime = 0;
    let totalAchievedQty = 0;
    let totalTargetQty = 0;
    let totalGoodAchievedQty = 0;
    let totalScrapAchievedQty = 0;

    try {
      // Get current time and round up to the next hour
      const now = new Date();
      const currentHour = Math.ceil(now.getHours() + now.getMinutes() / 60);
      // Limit the end time to the next hour or shiftEndTime, whichever is earlier
      const effectiveEndTime = Math.min(currentHour, shiftEndTime);

      // Compute adjusted date for Night shift post-midnight
      function getShiftDate(shift, productionDate) {
        const currentHour = new Date().getHours();

        if (shift === "Night" && currentHour >= 0 && currentHour < 12) {
          const nextDay = new Date(productionDate);
          nextDay.setDate(nextDay.getDate() + 1);
          return nextDay.toISOString().split("T")[0]; // format YYYY-MM-DD
        }

        return productionDate;
      }

      for (let hour = shiftStartTime; hour < effectiveEndTime; hour++) {
        const fromTime = `${hour.toString().padStart(2, "0")}:00:00`;
        const toTime = `${(hour + 1).toString().padStart(2, "0")}:00:00`;

        // Fetch unplannedDowntime duration
        const unplannedDowntimeRows = await connection2.query(
          `SELECT SUM(TIMESTAMPDIFF(MINUTE, GREATEST(startTime, ?), LEAST(endTime, ?))) AS duration_minutes
           FROM optima_downtime_tracking_tbl
           WHERE is_active = 1 AND station = ? AND productionDate = ? AND shift = ?
           AND planned_status = 'unplanned' AND startTime < ? AND endTime > ?`,
          [fromTime, toTime, station, productionDate, shift, toTime, fromTime]
        );

        // Fetch plannedDowntime duration
        const plannedDowntimeRows = await connection2.query(
          `SELECT SUM(TIMESTAMPDIFF(MINUTE, GREATEST(startTime, ?), LEAST(endTime, ?))) AS duration_minutes
           FROM optima_downtime_tracking_tbl
           WHERE is_active = 1 AND station = ? AND productionDate = ? AND shift = ?
           AND planned_status = 'planned' AND startTime < ? AND endTime > ?`,
          [fromTime, toTime, station, productionDate, shift, toTime, fromTime]
        );

        // Fetch target quantity and units per sensor signal
        const targetQtyRows = await connection2.query(
          `SELECT cycleTime AS target_per_hour, unitsPerSensorSignal
           FROM optima_product_tracking_tbl
           WHERE is_active = 1 AND station = ? AND productionDate = ? AND shift = ?
           AND startTime < ? AND endTime > ?`,
          [station, productionDate, shift, toTime, fromTime]
        );

        // Fetch scrap quantity
        const scrapQtyRows = await connection2.query(
          `SELECT SUM(scrap_qty) AS scrap_qty
           FROM optima_scrap_tracking_tbl
           WHERE is_active = 1 AND station = ? AND production_date = ? AND shift = ?
           AND start_time < ? AND end_time > ?`,
          [station, productionDate, shift, toTime, fromTime]
        );

        const lineColumnMap = {
          "Final Line": "final_line_diff",
          "Internal Line": "internal_line_diff",
          "External Line": "external_line_diff",
        };

        if (!lineColumnMap.hasOwnProperty(station)) {
          throw new Error(`Invalid station name: ${station}`);
        }

        const column = lineColumnMap[station];

        // Fetch achieved quantity  ----- previous logic -------
        // const achivedQtyRows = await connection.query(
        //   `SELECT SUM(${column}) AS total_production_per_hour
        //    FROM optima_machine_data_entry
        //    WHERE timestamp >= ? AND timestamp < ?`,
        //   [`${productionDate} ${fromTime}`, `${productionDate} ${toTime}`]
        // );

        // Adjusted production date logic
        const adjustedProductionDate = getShiftDate(shift, productionDate);

        // Fetch achieved quantity
        const achivedQtyRows = await connection.query(
          `SELECT SUM(${column}) AS total_production_per_hour
          FROM optima_machine_data_entry
          WHERE timestamp >= ? AND timestamp < ?`,
          [
            `${adjustedProductionDate} ${fromTime}`,
            `${adjustedProductionDate} ${toTime}`,
          ]
        );

        //----------------- Hourly calculations sections start ----------------

        let availability = 0,
          performance = 0,
          quality = 0,
          oee = 0;

        //-------------- Availability calculation ---------------

        const unplannedDowntime =
          unplannedDowntimeRows[0].duration_minutes || 0;
        const plannedDowntime = plannedDowntimeRows[0].duration_minutes || 0;
        const plannedTime = 60 - plannedDowntime;
        const runningTime = plannedTime - unplannedDowntime;

        availability =
          plannedTime === 0
            ? 0
            : ((runningTime / plannedTime) * 100).toFixed(2);

        //-------------- Performance calculation ---------------

        const unitsPerSensorSignal =
          targetQtyRows[0]?.unitsPerSensorSignal || 0;
        let targetPerHour = targetQtyRows[0]?.target_per_hour || 0;
        targetPerHour = targetPerHour > 0 && (targetPerHour / 60) * plannedTime;
        const cycleTime = targetPerHour !== 0 ? plannedTime / targetPerHour : 0;
        const rawAchieved = achivedQtyRows[0]?.total_production_per_hour || 0;
        const achievedQtyPerHour = rawAchieved * unitsPerSensorSignal;
        const productionTime = achievedQtyPerHour * cycleTime;
        performance =
          runningTime === 0
            ? 0
            : ((productionTime / runningTime) * 100).toFixed(2);

        //-------------- Quality calculation ---------------

        const scrapQtyPerHour = scrapQtyRows[0]?.scrap_qty || 0;
        const goodAchievedQtyPerHour = achievedQtyPerHour - scrapQtyPerHour;
        const actualProductionTime = goodAchievedQtyPerHour * cycleTime;
        quality =
          productionTime === 0
            ? 0
            : ((actualProductionTime / productionTime) * 100).toFixed(2);

        //-------------- OEE calculation ---------------

        oee = ((availability * performance * quality) / 10000).toFixed(2);

        //---------------- Store hourly data ------------------
        data.push({
          hour: `${fromTime} - ${toTime}`,
          targetPerHour: targetPerHour ? parseInt(targetPerHour) : 0,
          achievedQtyPerHour: achievedQtyPerHour
            ? parseInt(achievedQtyPerHour)
            : 0,
          plannedDowntime: plannedDowntime ? plannedDowntime : 0,
          unplannedDowntime: unplannedDowntime ? unplannedDowntime : 0,
          availability: parseFloat(availability),
          performance: parseFloat(performance),
          quality: parseFloat(quality),
          oee: parseFloat(oee),
        });

        //-------------- Accumulate totals ---------------

        totalPlannedTime += parseInt(plannedTime);
        totalRunningTime += parseInt(runningTime);
        totalUnplannedDowntime += parseInt(unplannedDowntime);
        totalPlannedDowntime += parseInt(plannedDowntime);
        totalProductionTime += parseInt(productionTime);
        totalActualProductionTime += parseInt(actualProductionTime);
        totalAchievedQty += parseInt(achievedQtyPerHour);
        totalTargetQty += parseInt(targetPerHour);
        totalGoodAchievedQty += parseInt(goodAchievedQtyPerHour);
        totalScrapAchievedQty += parseInt(scrapQtyPerHour);
      }

      //---------------Calculate Total shift section calculation start -------------

      //-------------- Total Availability calculation ---------------

      const shiftAvailability = (
        totalPlannedTime === 0 ? 0 : (totalRunningTime / totalPlannedTime) * 100
      ).toFixed(2);

      //-------------- Total Performance calculation ---------------

      const shiftPerformance = (
        totalRunningTime === 0
          ? 0
          : (totalProductionTime / totalRunningTime) * 100
      ).toFixed(2);

      //-------------- Total Quality calculation ---------------

      const shiftQuality = (
        totalProductionTime === 0
          ? 0
          : (totalActualProductionTime / totalProductionTime) * 100
      ).toFixed(2);

      //-------------- Total OEE calculation ---------------

      const shiftOEE = (
        (shiftAvailability * shiftPerformance * shiftQuality) /
        10000
      ).toFixed(2);

      //--------------- Store Shift summary for totalOEE -------------------

      const totalOEE = {
        shift: `${shift} Shift (${shiftStartTime}:00 - ${effectiveEndTime}:00)`,
        totalPlannedMinutes: totalPlannedTime,
        totalRunningMinutes: totalRunningTime,
        totalPlannedDowntimeMinutes: totalPlannedDowntime,
        totalUnplannedDowntimeMinutes: totalUnplannedDowntime,
        totalAchievedQty: Math.round(totalAchievedQty),
        totalTargetQty: Math.round(totalTargetQty),
        totalGoodQty: Math.round(totalGoodAchievedQty),
        totalScrapQty: Math.round(totalScrapAchievedQty),
        availability: parseFloat(shiftAvailability),
        performance: parseFloat(shiftPerformance),
        quality: parseFloat(shiftQuality),
        oee: parseFloat(shiftOEE),
      };

      return {
        hourlyOEE: data,
        totalOEE,
      };
    } catch (error) {
      console.error("Error calculating OEE metrics:", error);
      throw new Error(`OEE calculation failed: ${error.message}`);
    }
  }

  static async checkExistingMetrics({
    station,
    productionDate,
    shift,
    shiftStartTime,
    shiftEndTime,
  }) {
    try {
      const result = await connection2.query(
        `SELECT id FROM optima_oee_metrics_tbl
         WHERE station = ? AND productionDate = ? AND shift = ? AND shiftStartTime = ? AND shiftEndTime = ? AND is_active = 1`,
        [
          station,
          productionDate,
          shift,
          `${shiftStartTime}:00:00`,
          `${shiftEndTime}:00:00`,
        ]
      );
      return result.length > 0 ? result[0].id : null;
    } catch (error) {
      console.error("Error checking existing OEE metrics:", error);
      throw new Error(`Database query failed: ${error.message}`);
    }
  }

  static async createOEEMetrics(metricsData) {
    const {
      station,
      productionDate,
      shift,
      shiftStartTime,
      shiftEndTime,
      hourlyOEE,
      totalOEE,
      creator,
    } = metricsData;

    try {
      const result = await connection2.query(
        `INSERT INTO optima_oee_metrics_tbl (
          station, productionDate, shift, shiftStartTime, shiftEndTime,
          hourlyOEE, totalOEE, creator, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [
          station,
          productionDate,
          shift,
          `${shiftStartTime}:00:00`,
          `${shiftEndTime}:00:00`,
          JSON.stringify(hourlyOEE),
          JSON.stringify(totalOEE),
          creator,
        ]
      );
      return result;
    } catch (error) {
      console.error("Error creating OEE metrics record:", error);
      throw new Error(`Database insert failed: ${error.message}`);
    }
  }

  static async updateOEEMetrics(id, metricsData) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid or missing id");
    }

    const {
      station,
      productionDate,
      shift,
      shiftStartTime,
      shiftEndTime,
      hourlyOEE,
      totalOEE,
    } = metricsData;

    try {
      const result = await connection2.query(
        `UPDATE optima_oee_metrics_tbl SET
          station = ?, productionDate = ?, shift = ?, shiftStartTime = ?, shiftEndTime = ?,
          hourlyOEE = ?, totalOEE = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ? AND is_active = 1`,
        [
          station,
          productionDate,
          shift,
          `${shiftStartTime}:00:00`,
          `${shiftEndTime}:00:00`,
          JSON.stringify(hourlyOEE),
          JSON.stringify(totalOEE),
          parseInt(id),
        ]
      );
      return result;
    } catch (error) {
      console.error("Error updating OEE metrics record:", error);
      throw new Error(`Database update failed: ${error.message}`);
    }
  }

  static async saveOEEMetrics({
    station,
    productionDate,
    shift,
    shiftStartTime,
    shiftEndTime,
    creator,
  }) {
    try {
      // Calculate OEE metrics
      const { hourlyOEE, totalOEE } = await this.calculateHourlyMetrics({
        station,
        productionDate,
        shift,
        shiftStartTime,
        shiftEndTime,
      });

      // Check if record exists
      const existingId = await this.checkExistingMetrics({
        station,
        productionDate,
        shift,
        shiftStartTime,
        shiftEndTime,
      });

      // Prepare metrics data
      const metricsData = {
        station,
        productionDate,
        shift,
        shiftStartTime,
        shiftEndTime,
        hourlyOEE,
        totalOEE,
        creator: creator,
      };

      if (existingId) {
        // Update existing record
        await this.updateOEEMetrics(existingId, metricsData);
        return {
          status: "updated",
          id: existingId,
          data: { hourlyOEE, totalOEE },
        };
      } else {
        // Create new record
        const result = await this.createOEEMetrics(metricsData);
        return {
          status: "created",
          id: result.insertId,
          data: { hourlyOEE, totalOEE },
        };
      }
    } catch (error) {
      console.error("Error saving OEE metrics:", error);
      throw new Error(`Failed to save OEE metrics: ${error.message}`);
    }
  }

  static async getOEEMetricsByDate({ station, productionDate, shift }) {
    try {
      // Query to fetch OEE metrics from optima_oee_metrics_tbl
      const result = await connection2.query(
        `SELECT hourlyOEE, totalOEE
         FROM optima_oee_metrics_tbl
         WHERE station = ? AND productionDate = ? AND shift = ? AND is_active = 1`,
        [station, productionDate, shift]
      );
      // Check if data exists
      if (result.length === 0) {
        return {
          message:
            "No OEE metrics found for the specified station, date, and shift",
          data: null,
        };
      }

      // Parse JSON fields
      const hourlyOEE = JSON.parse(result[0].hourlyOEE);
      const totalOEE = JSON.parse(result[0].totalOEE);

      return { hourlyOEE, totalOEE };
    } catch (error) {
      console.error("Error fetching OEE metrics from database:", error);
      throw new Error(`Failed to fetch OEE metrics: ${error.message}`);
    }
  }

  static async getOEEMetricsByAll() {
    try {
      // Query to fetch OEE metrics from optima_oee_metrics_tbl
      const result = await connection2.query(
        `SELECT * FROM optima_oee_metrics_tbl WHERE is_active = 1 ORDER BY id DESC`
      );

      // Check if data exists
      if (result.length === 0) {
        return {
          message: "No OEE metrics found",
          data: null,
        };
      }

      // Parse JSON strings in hourlyOEE and totalOEE
      const formattedResult = result.map((item) => ({
        ...item,
        hourlyOEE: JSON.parse(item.hourlyOEE),
        totalOEE: JSON.parse(item.totalOEE),
      }));

      return formattedResult;
    } catch (error) {
      console.error("Error fetching OEE metrics from database:", error);
      throw new Error(`Failed to fetch OEE metrics: ${error.message}`);
    }
  }
}

module.exports = OEEMetrics;
