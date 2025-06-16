const OEEMetrics = require("../models/calculateOEEMetrics");

class OEEMetricsController {
  static async saveOEEMetrics(req, res) {
    try {
      const {
        station,
        productionDate,
        shift,
        shiftStartTime,
        shiftEndTime,
        creator,
      } = req.body;

      // Validate required fields
      if (
        !station ||
        !productionDate ||
        !shift ||
        shiftStartTime === undefined ||
        shiftEndTime === undefined
      ) {
        return res.status(400).json({
          error:
            "Missing required fields: station, productionDate, shift, shiftStartTime, or shiftEndTime",
        });
      }

      // Validate date format (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(productionDate)) {
        return res
          .status(400)
          .json({ error: "Invalid productionDate format (use YYYY-MM-DD)" });
      }

      // Validate shift times
      if (
        !Number.isInteger(shiftStartTime) ||
        !Number.isInteger(shiftEndTime) ||
        shiftStartTime < 0 ||
        shiftStartTime > 23 ||
        shiftEndTime < 0 ||
        shiftEndTime > 24 ||
        shiftStartTime >= shiftEndTime
      ) {
        return res.status(400).json({
          error:
            "Invalid shiftStartTime or shiftEndTime (must be integers, 0-23, start < end)",
        });
      }

      const result = await OEEMetrics.saveOEEMetrics({
        station,
        productionDate,
        shift,
        shiftStartTime,
        shiftEndTime,
        creator,
      });

      return res.status(result.status === "created" ? 201 : 200).json({
        message: `OEE metrics ${result.status} successfully`,
        id: result.id,
        data: result.data,
      });
    } catch (error) {
      console.error("Error in saveOEEMetrics:", error);
      return res
        .status(500)
        .json({ error: `Failed to save OEE metrics: ${error.message}` });
    }
  }

  static async getOEEMetricsByDate(req, res) {
    try {
      const { station, productionDate, shift } = req.query;

      // Validate required fields
      if (!station || !productionDate || !shift) {
        return res.status(400).json({
          error:
            "Missing required query parameters: station, productionDate, or shift",
        });
      }

      // Validate date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(productionDate)) {
        return res
          .status(400)
          .json({ error: "Invalid productionDate format (use YYYY-MM-DD)" });
      }

      const result = await OEEMetrics.getOEEMetricsByDate({
        station,
        productionDate,
        shift,
      });
      if (!result) {
        return res.status(404).json({
          message: result.message,
        });
      }

      return res.status(200).json({
        message: "OEE metrics retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in getOEEMetricsByDate:", error);
      return res
        .status(500)
        .json({ error: `Failed to retrieve OEE metrics: ${error.message}` });
    }
  }

  static async getOEEMetricsByAll(req, res) {
    try {
      const result = await OEEMetrics.getOEEMetricsByAll();
      if (result.data === null) {
        return res.status(404).json({
          message: result.message,
        });
      }

      return res.status(200).json({
        message: "OEE metrics retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Error in getOEEMetricsByAll:", error);
      return res
        .status(500)
        .json({ error: `Failed to retrieve OEE metrics: ${error.message}` });
    }
  }
}

module.exports = OEEMetricsController;
