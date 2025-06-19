import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validar que todos los campos estén presentes
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Verificar si el usuario ya existe
    const [user] = await User.findUserByEmail(email);
    if (user.length) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Hashear la contraseña
    const hash = await bcrypt.hash(password, 10);
    
    // Crear el usuario
    const [result] = await User.createUser(name, email, hash);
    
    // Generar el token JWT con el ID del nuevo usuario
    const token = jwt.sign(
      { 
        id: result.insertId,
        email: email,
        name: name 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // Responder con el token y datos del usuario
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: result.insertId,
        name,
        email
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario
    const [user] = await User.findUserByEmail(email);
    if (!user.length) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar token
    const token = jwt.sign(
      { 
        id: user[0].id,
        email: user[0].email,
        name: user[0].name 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    // Responder con token y datos del usuario
    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};