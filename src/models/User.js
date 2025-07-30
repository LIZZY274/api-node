import { pool } from '../config/db.js';

// Crear un nuevo usuario
export const createUser = (name, email, hashedPassword) =>
  pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

// Buscar usuario por email
export const findUserByEmail = (email) =>
  pool.query('SELECT * FROM users WHERE email = ?', [email]);

// Buscar usuario por ID
export const findUserById = (id) =>
  pool.query('SELECT id, name, email, created_at FROM users WHERE id = ?', [id]);

// Obtener todos los usuarios (sin passwords)
export const getAllUsers = () =>
  pool.query('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC');

// Actualizar usuario
export const updateUser = (id, name, email) =>
  pool.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);

// Eliminar usuario
export const deleteUser = (id) =>
  pool.query('DELETE FROM users WHERE id = ?', [id]);

// Verificar si un email ya existe (útil para validaciones)
export const emailExists = async (email) => {
  const [result] = await pool.query('SELECT COUNT(*) as count FROM users WHERE email = ?', [email]);
  return result[0].count > 0;
};