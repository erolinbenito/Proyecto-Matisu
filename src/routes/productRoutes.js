// src/routes/productRoutes.js
import express from "express";
import * as productController from "../controllers/productController.js";

const router = express.Router();

// Rutas básicas CRUD
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

// Rutas adicionales
router.patch("/:id/stock", productController.updateStock);
router.get("/categoria/:categoryId", productController.getProductsByCategory);

export default router;
