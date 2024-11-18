// src/models/userModel.js
import pool from "../config/database.js";

export const findAll = async () => {
  const [rows] = await pool.query("SELECT * FROM usuarios");
  return rows;
};

export const findById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);
  return rows[0];
};

export const create = async (userData) => {
  const { rol_id, nombre, apellido, email, password, direccion, telefono } =
    userData;
  const [result] = await pool.query(
    "INSERT INTO usuarios (rol_id, nombre, apellido, email, password, direccion, telefono) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [rol_id, nombre, apellido, email, password, direccion, telefono]
  );
  return result.insertId;
};

export const findOrders = async (userId) => {
  const [rows] = await pool.query(
    `SELECT p.*, ep.nombre as estado
         FROM pedidos p
         JOIN estados_pedido ep ON p.estado_id = ep.id
         WHERE p.usuario_id = ?
         ORDER BY p.fecha_pedido DESC`,
    [userId]
  );
  return rows;
};
