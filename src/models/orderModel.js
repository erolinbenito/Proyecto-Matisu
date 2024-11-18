// src/models/orderModel.js
import pool from "../config/database.js";

export const create = async ({
  usuario_id,
  productos,
  direccion_envio,
  notas,
}) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    let total = 0;

    // Verificar stock y calcular total
    for (const item of productos) {
      const [productRows] = await connection.query(
        "SELECT precio, stock FROM productos WHERE id = ? AND activo = true",
        [item.producto_id]
      );

      if (productRows.length === 0) {
        throw new Error(`Producto ${item.producto_id} no encontrado`);
      }

      if (productRows[0].stock < item.cantidad) {
        throw new Error(
          `Stock insuficiente para el producto ${item.producto_id}`
        );
      }

      total += productRows[0].precio * item.cantidad;
    }

    // Crear el pedido
    const [orderResult] = await connection.query(
      `INSERT INTO pedidos (usuario_id, estado_id, total, direccion_envio, notas) 
             VALUES (?, 1, ?, ?, ?)`,
      [usuario_id, total, direccion_envio, notas]
    );

    // Insertar detalles del pedido y actualizar stock
    for (const item of productos) {
      const [productRows] = await connection.query(
        "SELECT precio FROM productos WHERE id = ?",
        [item.producto_id]
      );

      await connection.query(
        `INSERT INTO detalles_pedido 
                 (pedido_id, producto_id, cantidad, precio_unitario, subtotal) 
                 VALUES (?, ?, ?, ?, ?)`,
        [
          orderResult.insertId,
          item.producto_id,
          item.cantidad,
          productRows[0].precio,
          productRows[0].precio * item.cantidad,
        ]
      );

      await connection.query(
        "UPDATE productos SET stock = stock - ? WHERE id = ?",
        [item.cantidad, item.producto_id]
      );
    }

    await connection.commit();
    return {
      orderId: orderResult.insertId,
      total,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const findById = async (id) => {
  const [orderRows] = await pool.query(
    `SELECT p.*, ep.nombre as estado, u.nombre as usuario_nombre, u.email
         FROM pedidos p
         JOIN estados_pedido ep ON p.estado_id = ep.id
         JOIN usuarios u ON p.usuario_id = u.id
         WHERE p.id = ?`,
    [id]
  );

  if (orderRows.length === 0) return null;

  const [detailsRows] = await pool.query(
    `SELECT dp.*, pr.nombre as producto_nombre
         FROM detalles_pedido dp
         JOIN productos pr ON dp.producto_id = pr.id
         WHERE dp.pedido_id = ?`,
    [id]
  );

  return {
    ...orderRows[0],
    detalles: detailsRows,
  };
};

export const findByUserId = async (userId) => {
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

export const updateStatus = async (id, estadoId) => {
  const [result] = await pool.query(
    "UPDATE pedidos SET estado_id = ? WHERE id = ?",
    [estadoId, id]
  );
  return result.affectedRows > 0;
};

export const findAll = async ({ fecha_inicio, fecha_fin, estado } = {}) => {
  let query = `
        SELECT p.*, ep.nombre as estado, 
               u.nombre as usuario_nombre, u.email
        FROM pedidos p
        JOIN estados_pedido ep ON p.estado_id = ep.id
        JOIN usuarios u ON p.usuario_id = u.id
        WHERE 1=1
    `;
  const values = [];

  if (fecha_inicio) {
    query += " AND p.fecha_pedido >= ?";
    values.push(fecha_inicio);
  }

  if (fecha_fin) {
    query += " AND p.fecha_pedido <= ?";
    values.push(fecha_fin);
  }

  if (estado) {
    query += " AND p.estado_id = ?";
    values.push(estado);
  }

  query += " ORDER BY p.fecha_pedido DESC";

  const [rows] = await pool.query(query, values);
  return rows;
};
