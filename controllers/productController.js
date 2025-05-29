const Product = require("../models/product");

const getProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createProduct = async (req, res) => {
  try {
    await Product.create(req.body);
    res.json({ success: true, message: "Product added successfully" });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const result = await Product.update(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found or inactive" });
    }
    res.json({ success: true, message: "Product updated successfully" });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const result = await Product.deleteProduct(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found or inactive" });
    }
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSpecificProducts = async (req, res) => {
  try {
    const { stations } = req.query;

    if (!stations) {
      return res.status(400).json({
        error: "Missing required parameters: stations is required",
      });
    }

    const productData = { stations };
    const products = await Product.getSpecificAll(productData);
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
};

const createProductRecords = async (req, res) => {
  try {
    await Product.createProductRecords(req.body);
    res.json({ success: true, message: "Product record saved successfully" });
  } catch (err) {
    console.error("Error saving product record:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

const getSpecificProductRecords = async (req, res) => {
  try {
    const { station, shift } = req.query;

    if (!station || !shift) {
      return res.status(400).json({
        error: "Missing required parameters: station and shift are required",
      });
    }

    const requiredData = { station, shift };
    const productData = await Product.getSpecificProductRecords(requiredData);
    res.json(productData);
  } catch (err) {
    console.error("Error fetching product data:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
};

const getSpecificProductReport = async (req, res) => {
  try {
    const { station, shift, date } = req.query;

    if (!station || !shift || !date) {
      return res.status(400).json({
        error:
          "Missing required parameters: station, shift, and date are required",
      });
    }

    const requiredData = { station, shift, date };
    const productData = await Product.getSpecificProductReport(requiredData);
    res.json(productData);
  } catch (err) {
    console.error("Error fetching product data:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message,
    });
  }
};

const updateProductRecord = async (req, res) => {
  try {
    const { id } = req.params;
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
    } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid or missing id" });
    }

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
      return res
        .status(400)
        .json({ error: "Missing required fields for product record update" });
    }

    const result = await Product.updateProductRecord(id, req.body);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Product record not found or inactive" });
    }

    res.json({ success: true, message: "Product record updated successfully" });
  } catch (err) {
    console.error("Error updating product record:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

const deleteProductRecord = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid or missing id" });
    }

    const result = await Product.deleteProductRecord(id);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Product record not found or inactive" });
    }

    res.json({ success: true, message: "Product record deleted successfully" });
  } catch (err) {
    console.error("Error deleting product record:", err);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: err.message });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSpecificProducts,
  createProductRecords,
  getSpecificProductRecords,
  getSpecificProductReport,
  updateProductRecord,
  deleteProductRecord,
};
