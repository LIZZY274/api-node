import Product from "../models/productModel.js";

export const createProduct = (req, res) => {
  const { name, description, price } = req.body;
  const userId = req.user.id; 

  if (!name || !description || !price) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  Product.create(userId, name, description, price, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Producto creado", id: result.insertId });
  });
};

export const getUserProducts = (req, res) => {
  const userId = req.user.id; 

  Product.getByUserId(userId, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ products: result });
  });
};

export const deleteProduct = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; 

  Product.delete(id, userId, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: "Producto eliminado exitosamente" });
  });
};
