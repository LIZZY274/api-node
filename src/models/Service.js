import { pool } from '../config/db.js';

// Obtener 
export const getServicesByUser = (userId) =>
  pool.query(
    'SELECT id, tipo, fecha, costo, taller, descripcion, imagenUrl, user_id, created_at FROM services WHERE user_id = ? ORDER BY created_at DESC', 
    [userId]
  );

//  Incluir user_id en todas las consultas
export const getAllServices = () =>
  pool.query('SELECT id, tipo, fecha, costo, taller, descripcion, imagenUrl, user_id, created_at FROM services ORDER BY created_at DESC');

export const getServiceById = (id, userId) =>
  pool.query(
    'SELECT id, tipo, fecha, costo, taller, descripcion, imagenUrl, user_id, created_at FROM services WHERE id = ? AND user_id = ?', 
    [id, userId]
  );


export const createService = (tipo, fecha, costo, taller, descripcion, imagenUrl, userId) =>
  pool.query(
    'INSERT INTO services (tipo, fecha, costo, taller, descripcion, imagenUrl, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [tipo, fecha, costo, taller, descripcion, imagenUrl, userId]
  );


export const updateService = (id, tipo, fecha, costo, taller, descripcion, imagenUrl, userId) =>
  pool.query(
    'UPDATE services SET tipo=?, fecha=?, costo=?, taller=?, descripcion=?, imagenUrl=? WHERE id=? AND user_id=?',
    [tipo, fecha, costo, taller, descripcion, imagenUrl, id, userId]
  );

export const deleteService = (id, userId) =>
  pool.query('DELETE FROM services WHERE id = ? AND user_id = ?', [id, userId]);

//  Para sincronización ROOM - obtener servicios modificados después de una fecha
export const getServicesModifiedAfter = (userId, timestamp) =>
  pool.query(
    'SELECT id, tipo, fecha, costo, taller, descripcion, imagenUrl, user_id, created_at, updated_at FROM services WHERE user_id = ? AND updated_at > ? ORDER BY updated_at DESC',
    [userId, timestamp]
  );