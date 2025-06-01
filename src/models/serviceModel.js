import db from '../config/db.js';

const Service = {
  create: (userId, tipo, fecha, costo, taller, descripcion, callback) => {
    const query = "INSERT INTO services (user_id, tipo, fecha, costo, taller, descripcion) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(query, [userId, tipo, fecha, costo, taller, descripcion], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  },

  getByUserId: (userId, callback) => {
    const query = "SELECT * FROM services WHERE user_id = ? ORDER BY fecha DESC";
    db.query(query, [userId], (err, results) => {
      if (err) return callback(err);
      callback(null, results);
    });
  },

  update: (id, userId, tipo, fecha, costo, taller, descripcion, callback) => {
    const query = "UPDATE services SET tipo = ?, fecha = ?, costo = ?, taller = ?, descripcion = ? WHERE id = ? AND user_id = ?";
    db.query(query, [tipo, fecha, costo, taller, descripcion, id, userId], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  },

  delete: (id, userId, callback) => {
    const query = "DELETE FROM services WHERE id = ? AND user_id = ?";
    db.query(query, [id, userId], (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    });
  },
};

export default Service;
