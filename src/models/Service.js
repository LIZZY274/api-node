import { pool } from '../config/db.js';

// ✅ ACTUALIZADO: Incluir imagenUrl en todas las consultas
export const getAllServices = () => 
  pool.query('SELECT id, tipo, fecha, costo, taller, descripcion, imagenUrl FROM services ORDER BY created_at DESC');

export const getServiceById = (id) => 
  pool.query('SELECT id, tipo, fecha, costo, taller, descripcion, imagenUrl FROM services WHERE id = ?', [id]);

// ✅ ACTUALIZADO: Incluir imagenUrl en INSERT
export const createService = (tipo, fecha, costo, taller, descripcion, imagenUrl) =>
  pool.query(
    'INSERT INTO services (tipo, fecha, costo, taller, descripcion, imagenUrl) VALUES (?, ?, ?, ?, ?, ?)',
    [tipo, fecha, costo, taller, descripcion, imagenUrl]
  );

// ✅ ACTUALIZADO: Incluir imagenUrl en UPDATE
export const updateService = (id, tipo, fecha, costo, taller, descripcion, imagenUrl) =>
  pool.query(
    'UPDATE services SET tipo=?, fecha=?, costo=?, taller=?, descripcion=?, imagenUrl=? WHERE id=?',
    [tipo, fecha, costo, taller, descripcion, imagenUrl, id]
  );

export const deleteService = (id) => 
  pool.query('DELETE FROM services WHERE id = ?', [id]);