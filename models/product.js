const { connection2 } = require("../config/db");

class Product {
  static async getAll() {
    const result = await connection2.query(
      "SELECT * FROM `optima_products_tbl` WHERE is_active = 1"
    );
    return result;
  }

  static async create(productData) {
    const {
      productName,
      productCode,
      productGroup,
      stations,
      unit,
      cycleTime,
      unitsPerSensorSignal,
      creator,
    } = productData;
    const result = await connection2.query(
      "INSERT INTO `optima_products_tbl` (productName, productCode, productGroup, stations, unit, cycleTime, unitsPerSensorSignal, creator) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        productName,
        productCode,
        productGroup,
        stations,
        unit,
        cycleTime,
        unitsPerSensorSignal,
        creator,
      ]
    );
    return result;
  }

  static async update(id, updateData) {
    const {
      productName,
      productCode,
      productGroup,
      stations,
      unit,
      cycleTime,
      unitsPerSensorSignal,
      creator,
    } = updateData;
    const result = await connection2.query(
      "UPDATE optima_products_tbl SET productName = ?, productCode = ?, productGroup = ?, stations = ?, unit = ?, cycleTime = ?, unitsPerSensorSignal = ?, creator = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND is_active = 1",
      [
        productName,
        productCode,
        productGroup,
        stations,
        unit,
        cycleTime,
        unitsPerSensorSignal,
        creator,
        id,
      ]
    );
    return result;
  }

  static async deleteProduct(id) {
    const result = await connection2.query(
      "UPDATE optima_products_tbl SET is_active = 0 WHERE id = ? AND is_active = 1",
      [id]
    );
    return result;
  }

  static async getSpecificAll(productData) {
    try {
      const { stations } = productData;
      const result = await connection2.query(
        "SELECT * FROM optima_products_tbl WHERE stations LIKE CONCAT('%', ?, '%') AND is_active = 1",
        [stations]
      );
      return result;
    } catch (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }
  }

  static async createProductRecords(productData) {
    const {
      productName,
      productCode,
      productGroup,
      station,
      productionDate,
      shift,
      cycleTime,
      unitsPerSensorSignal,
      startTime,
      endTime,
      qty,
      creator,
    } = productData;
    const result = await connection2.query(
      "INSERT INTO `optima_product_tracking_tbl` (productName, productCode, productGroup, station, productionDate, shift, cycleTime, unitsPerSensorSignal, startTime, endTime, qty, creator) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        productName,
        productCode,
        productGroup,
        station,
        productionDate,
        shift,
        cycleTime,
        unitsPerSensorSignal,
        startTime,
        endTime,
        qty,
        creator,
      ]
    );
    return result;
  }

  static async getSpecificProductRecords(requiredData) {
    const date = new Date();
    const currentDate = date.toISOString().slice(0, 10); // Format: YYYY-MM-DD
    try {
      const { station, shift } = requiredData;
      const result = await connection2.query(
        "SELECT * FROM optima_product_tracking_tbl WHERE station = ? AND shift = ? AND productionDate = ? AND is_active = 1",
        [station, shift, currentDate]
      );
      return result;
    } catch (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }
  }

  static async getSpecificProductReport(requiredData) {
    try {
      const { station, shift, date } = requiredData;
      const result = await connection2.query(
        "SELECT * FROM optima_product_tracking_tbl WHERE station = ? AND shift = ? AND productionDate = ? AND is_active = 1",
        [station, shift, date]
      );
      return result;
    } catch (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }
  }

  static async updateProductRecord(id, productData) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid or missing id");
    }
    if (!productData || typeof productData !== "object") {
      throw new Error("Invalid or missing product data");
    }

    const {
      productName,
      productCode,
      productGroup,
      station,
      productionDate,
      shift,
      cycleTime,
      unitsPerSensorSignal,
      startTime,
      endTime,
      qty,
      creator,
    } = productData;

    if (
      !productName ||
      !productCode ||
      !productGroup ||
      !station ||
      !productionDate ||
      !shift ||
      !cycleTime ||
      !unitsPerSensorSignal ||
      !startTime ||
      !endTime ||
      !qty ||
      !creator
    ) {
      throw new Error("Missing required fields for product record update");
    }

    try {
      const result = await connection2.query(
        "UPDATE `optima_product_tracking_tbl` SET productName = ?, productCode = ?, productGroup = ?, station = ?, productionDate = ?, shift = ?, cycleTime = ?, unitsPerSensorSignal = ?, startTime = ?, endTime = ?, qty = ?, creator = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND is_active = 1",
        [
          productName,
          productCode,
          productGroup,
          station,
          productionDate,
          shift,
          cycleTime,
          unitsPerSensorSignal,
          startTime,
          endTime,
          qty,
          creator,
          parseInt(id),
        ]
      );
      return result;
    } catch (error) {
      console.error("Database error details:", error);
      throw new Error(`Database update failed: ${error.message}`);
    }
  }

  static async deleteProductRecord(id) {
    if (!id || isNaN(id)) {
      throw new Error("Invalid or missing id");
    }

    try {
      const result = await connection2.query(
        "UPDATE `optima_product_tracking_tbl` SET is_active = 0 WHERE id = ? AND is_active = 1",
        [parseInt(id)]
      );
      return result;
    } catch (error) {
      console.error("Database error details:", error);
      throw new Error(`Database delete failed: ${error.message}`);
    }
  }
}

module.exports = Product;
