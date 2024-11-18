// src/controllers/productController.js
import * as productModel from "../models/productModel.js";

export const getAllProducts = async (req, res, next) => {
  try {
    // Obtener parámetros de query para filtros opcionales
    const { categoria, buscar, precioMin, precioMax } = req.query;
    const products = await productModel.findAll({
      categoria,
      buscar,
      precioMin,
      precioMax,
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const productId = await productModel.create(req.body);
    res.status(201).json({
      id: productId,
      mensaje: "Producto creado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const updated = await productModel.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.json({ mensaje: "Producto actualizado exitosamente" });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const deleted = await productModel.remove(req.params.id);
    if (!deleted) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.json({ mensaje: "Producto eliminado exitosamente" });
  } catch (error) {
    next(error);
  }
};

export const updateStock = async (req, res, next) => {
  try {
    const { cantidad } = req.body;
    const updated = await productModel.updateStock(req.params.id, cantidad);
    if (!updated) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.json({ mensaje: "Stock actualizado exitosamente" });
  } catch (error) {
    next(error);
  }
};

export const getProductsByCategory = async (req, res, next) => {
  try {
    const products = await productModel.findByCategory(req.params.categoryId);
    res.json(products);
  } catch (error) {
    next(error);
  }
};
