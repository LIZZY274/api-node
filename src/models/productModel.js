import db from "../config/db.js";

const Product = {
  create: (userId, name, description, price, callback) => {
    db.query(
      "INSERT INTO products (user_id, name, description, price) VALUES (?, ?, ?, ?)",
      [userId, name, description, price],
      (err, result) => {
        if (err) return callback(err);
        return callback(null, result);
      }
    );
  },

  getByUserId: (userId, callback) => {
    db.query(
      "SELECT * FROM products WHERE user_id = ?",
      [userId],
      (err, result) => {
        if (err) return callback(err);
        return callback(null, result);
      }
    );
  },

  delete: (id, userId, callback) => {
    db.query(
      "DELETE FROM products WHERE id = ? AND user_id = ?",
      [id, userId],
      (err, result) => {
        if (err) return callback(err);
        return callback(null, result);
      }
    );
  },
};

export default Product;
