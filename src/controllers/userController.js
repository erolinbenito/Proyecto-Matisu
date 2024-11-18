// src/controllers/userController.js
import * as userModel from "../models/userModel.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userModel.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const userId = await userModel.create(req.body);
    res.status(201).json({
      id: userId,
      mensaje: "Usuario creado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await userModel.findOrders(req.params.userId);
    res.json(orders);
  } catch (error) {
    next(error);
  }
};
