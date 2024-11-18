// src/controllers/orderController.js
import * as orderModel from "../models/orderModel.js";

export const createOrder = async (req, res, next) => {
  try {
    const { usuario_id, productos, direccion_envio, notas } = req.body;

    // Verificar que haya productos en el pedido
    if (!productos || productos.length === 0) {
      return res
        .status(400)
        .json({ mensaje: "El pedido debe contener al menos un producto" });
    }

    const orderData = await orderModel.create({
      usuario_id,
      productos,
      direccion_envio,
      notas,
    });

    res.status(201).json({
      id: orderData.orderId,
      mensaje: "Pedido creado exitosamente",
      total: orderData.total,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ mensaje: "Pedido no encontrado" });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await orderModel.findByUserId(req.params.userId);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { estado_id } = req.body;
    const updated = await orderModel.updateStatus(req.params.id, estado_id);
    if (!updated) {
      return res.status(404).json({ mensaje: "Pedido no encontrado" });
    }
    res.json({ mensaje: "Estado del pedido actualizado exitosamente" });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const { fecha_inicio, fecha_fin, estado } = req.query;
    const orders = await orderModel.findAll({
      fecha_inicio,
      fecha_fin,
      estado,
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};
