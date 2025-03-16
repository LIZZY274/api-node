import db from "../config/db.js";
import bcrypt from "bcryptjs";

const User = {
  create: (name, email, password, callback) => {
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) return callback(err);

      db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hash],
        (err, result) => {
          if (err) return callback(err);
          return callback(null, result);
        }
      );
    });
  },

  findByEmail: (email, callback) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
      if (err) return callback(err);
      callback(null, results.length > 0 ? results[0] : null); 
    });
  },

  existsByEmail: (email, callback) => {
    db.query("SELECT COUNT(*) AS count FROM users WHERE email = ?", [email], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0].count > 0);
    });
  },

  getAll: (callback) => {
    db.query("SELECT id, name, email FROM users", (err, result) => {
      if (err) return callback(err);
      return callback(null, result);
    });
  },

  delete: (id, callback) => {
    db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
      if (err) return callback(err);
      return callback(null, result);
    });
  },
};

export default User;
