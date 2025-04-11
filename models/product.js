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
    } = productData;
    const result = await connection2.query(
      "INSERT INTO `optima_products_tbl` (productName, productCode, productGroup, stations, unit, cycleTime, unitsPerSensorSignal) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        productName,
        productCode,
        productGroup,
        stations,
        unit,
        cycleTime,
        unitsPerSensorSignal,
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
    } = updateData;
    const result = await connection2.query(
      "UPDATE optima_products_tbl SET productName = ?, productCode = ?, productGroup = ?, stations = ?, unit = ?, cycleTime = ?, unitsPerSensorSignal = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND is_active = 1",
      [
        productName,
        productCode,
        productGroup,
        stations,
        unit,
        cycleTime,
        unitsPerSensorSignal,
        id,
      ]
    );
    return result;
  }

  static async delete(id) {
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
      cycleTime,
      unitsPerSensorSignal,
      startTime,
      endTime,
      qty,
    } = productData;
    const result = await connection2.query(
      "INSERT INTO `optima_product_tracking_tbl` (productName, productCode, productGroup, station, productionDate, cycleTime, unitsPerSensorSignal, startTime, endTime, qty) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        productName,
        productCode,
        productGroup,
        station,
        productionDate,
        cycleTime,
        unitsPerSensorSignal,
        startTime,
        endTime,
        qty,
      ]
    );
    return result;
  }
}

module.exports = Product;
