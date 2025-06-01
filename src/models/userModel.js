import db from '../config/db.js';
import bcrypt from 'bcryptjs';

const User = {
  create: async (name, email, password, callback) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      db.query(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (err, result) => {
          if (err) return callback(err);
          return callback(null, result);
        }
      );
    } catch (err) {
      return callback(err);
    }
  },

  findByEmail: (email, callback) => {
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err, results) => {
        if (err) return callback(err);
        return callback(null, results[0]);
      }
    );
  },

  checkPassword: async (user, password) => {
    return await bcrypt.compare(password, user.password);
  },
};

export default User;
