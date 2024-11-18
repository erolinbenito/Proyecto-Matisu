// src/routes/orderRoutes.js
import express from "express";
import * as orderController from "../controllers/orderController.js";

const router = express.Router();

// Crear un nuevo pedido
router.post("/", orderController.createOrder);

// Obtener todos los pedidos (con filtros opcionales)
router.get("/", orderController.getAllOrders);

// Obtener un pedido específico
router.get("/:id", orderController.getOrderById);

// Obtener pedidos de un usuario
router.get("/usuario/:userId", orderController.getUserOrders);

// Actualizar estado de un pedido
router.patch("/:id/estado", orderController.updateOrderStatus);

export default router;
