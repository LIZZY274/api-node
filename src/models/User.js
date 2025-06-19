import { pool } from '../config/db.js';

export const createUser = (name, email, hashedPassword) =>
  pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

export const findUserByEmail = (email) =>
  pool.query('SELECT * FROM users WHERE email = ?', [email]);
