// src/models/productModel.js
import pool from "../config/database.js";

export const findAll = async ({
  categoria,
  buscar,
  precioMin,
  precioMax,
} = {}) => {
  let query = `
        SELECT p.*, c.nombre as categoria_nombre 
        FROM productos p
        JOIN categorias c ON p.categoria_id = c.id
        WHERE p.activo = true
    `;
  const values = [];

  if (categoria) {
    query += " AND p.categoria_id = ?";
    values.push(categoria);
  }

  if (buscar) {
    query += " AND (p.nombre LIKE ? OR p.descripcion LIKE ?)";
    values.push(`%${buscar}%`, `%${buscar}%`);
  }

  if (precioMin) {
    query += " AND p.precio >= ?";
    values.push(precioMin);
  }

  if (precioMax) {
    query += " AND p.precio <= ?";
    values.push(precioMax);
  }

  query += " ORDER BY p.created_at DESC";

  const [rows] = await pool.query(query, values);
  return rows;
};

export const findById = async (id) => {
  const [rows] = await pool.query(
    `SELECT p.*, c.nombre as categoria_nombre 
         FROM productos p
         JOIN categorias c ON p.categoria_id = c.id
         WHERE p.id = ? AND p.activo = true`,
    [id]
  );
  return rows[0];
};

export const create = async (productData) => {
  const { categoria_id, nombre, descripcion, precio, stock, imagen_url } =
    productData;

  const [result] = await pool.query(
    `INSERT INTO productos (
            categoria_id, nombre, descripcion, 
            precio, stock, imagen_url
        ) VALUES (?, ?, ?, ?, ?, ?)`,
    [categoria_id, nombre, descripcion, precio, stock, imagen_url]
  );
  return result.insertId;
};

export const update = async (id, productData) => {
  const { categoria_id, nombre, descripcion, precio, stock, imagen_url } =
    productData;

  const [result] = await pool.query(
    `UPDATE productos 
         SET categoria_id = ?, 
             nombre = ?, 
             descripcion = ?, 
             precio = ?, 
             stock = ?, 
             imagen_url = ?
         WHERE id = ? AND activo = true`,
    [categoria_id, nombre, descripcion, precio, stock, imagen_url, id]
  );
  return result.affectedRows > 0;
};

export const remove = async (id) => {
  // Soft delete - solo marcamos como inactivo
  const [result] = await pool.query(
    "UPDATE productos SET activo = false WHERE id = ?",
    [id]
  );
  return result.affectedRows > 0;
};

export const updateStock = async (id, cantidad) => {
  const [result] = await pool.query(
    "UPDATE productos SET stock = stock + ? WHERE id = ? AND activo = true",
    [cantidad, id]
  );
  return result.affectedRows > 0;
};

export const findByCategory = async (categoryId) => {
  const [rows] = await pool.query(
    `SELECT p.*, c.nombre as categoria_nombre 
         FROM productos p
         JOIN categorias c ON p.categoria_id = c.id
         WHERE p.categoria_id = ? AND p.activo = true
         ORDER BY p.created_at DESC`,
    [categoryId]
  );
  return rows;
};
