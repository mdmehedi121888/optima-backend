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
    const result = await Product.delete(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found or inactive" });
    }
    res.json({ success: true, message: "Product Deleted Successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSpecificProducts = async (req, res) => {
  try {
    const { stations } = req.query;

    // Validate input
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
      message: err.message, // This will show the specific error message
    });
  }
};

const createProductRecords = async (req, res) => {
  try {
    await Product.createProductRecords(req.body);
    res.json({ success: true, message: "Product saved successfully" });
  } catch (err) {
    console.error("Error saved product:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSpecificProductRecords = async (req, res) => {
  try {
    const { station, shift } = req.query;

    // Validate input
    if (!station || !shift) {
      return res.status(400).json({
        error: "Missing required parameters: stations and shifts are required",
      });
    }

    const requiredData = { station, shift };
    const downtimeData = await Product.getSpecificProductRecords(requiredData);
    res.json(downtimeData);
  } catch (err) {
    console.error("Error fetching product data:", err);
    res.status(500).json({
      error: "Internal Server Error",
      message: err.message, // This will show the specific error message
    });
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
};
