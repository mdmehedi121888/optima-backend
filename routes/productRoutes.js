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
  getSpecificProductRecords,
  getSpecificProductReport,
  updateProductRecord,
  deleteProductRecord,
} = require("../controllers/productController");

router.get("/", isAuthenticated, getProducts);
router.get("/specific", getSpecificProducts);
router.get("/specificProductRecords", getSpecificProductRecords);
router.get("/getSpecificProductReport", getSpecificProductReport);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.post("/createProductRecords", createProductRecords);
router.put("/record/:id", updateProductRecord);
router.delete("/record/:id", deleteProductRecord);

module.exports = router;
