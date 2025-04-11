const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSpecificProducts,
  createProductRecords,
} = require("../controllers/productController");

router.get("/", isAuthenticated, getProducts);
router.get("/specific", getSpecificProducts);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.post("/createProductRecords", createProductRecords);

module.exports = router;
