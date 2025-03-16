import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "1234tg";

export const createUser = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  User.create(name, email, password, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Usuario creado", id: result.insertId });
  });
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    // Verificar si el usuario ya existe
    User.findByEmail(email, async (err, existingUser) => {
      if (err) return res.status(500).json({ error: err.message });
      if (existingUser)
        return res.status(400).json({ error: "El usuario ya existe" });

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear usuario
      User.create(name, email, hashedPassword, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        // Generar token
        const token = jwt.sign(
          { id: result.insertId, email },
          JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.status(201).json({
          message: "Usuario registrado exitosamente",
          id: result.insertId,
          token,
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};


export const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Correo y contraseña requeridos" });
  }

  User.findByEmail(email, (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!isMatch)
        return res.status(401).json({ error: "Credenciales inválidas" });

      const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({ message: "Login exitoso", token });
    });
  });
};

export const profileHandler = (req, res) => {
  return res.json({
    message: "Perfil del usuario",
    user: req.user,
  });
};

export const getAllUsers = (req, res) => {
  User.getAll((err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error getting users",
        error: err,
      });
    }
    return res.status(200).json({
      message: "Users retrieved successfully",
      users: result,
    });
  });
};

export const deleteUser = (req, res) => {
  const { id } = req.params;
  User.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Error deleting user",
        error: err,
      });
    }
    return res.status(200).json({
      message: "User deleted successfully",
    });
  });
};
