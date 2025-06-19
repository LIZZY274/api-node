import { pool } from '../config/db.js';

export const getAllServices = () => pool.query('SELECT * FROM services');

export const getServiceById = (id) => pool.query('SELECT * FROM services WHERE id = ?', [id]);

export const createService = (tipo, fecha, costo, taller, descripcion) =>
  pool.query('INSERT INTO services (tipo, fecha, costo, taller, descripcion) VALUES (?, ?, ?, ?, ?)',
    [tipo, fecha, costo, taller, descripcion]);

export const updateService = (id, tipo, fecha, costo, taller, descripcion) =>
  pool.query('UPDATE services SET tipo=?, fecha=?, costo=?, taller=?, descripcion=? WHERE id=?',
    [tipo, fecha, costo, taller, descripcion, id]);

export const deleteService = (id) => pool.query('DELETE FROM services WHERE id = ?', [id]);
