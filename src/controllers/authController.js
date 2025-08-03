import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as User from '../models/User.js';
import { sendWelcomeNotification } from '../utils/sendNotification.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET no está configurado en las variables de entorno');
      return res.status(500).json({ message: 'Error de configuración del servidor' });
    }

    const [user] = await User.findUserByEmail(email);
    if (user.length) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const hash = await bcrypt.hash(password, 10);
    const [result] = await User.createUser(name, email, hash);
    
    const token = jwt.sign(
      { 
        id: result.insertId,
        email: email,
        name: name 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    console.log('✅ Usuario registrado exitosamente:', email);
    console.log('🔐 Token JWT generado correctamente');

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
    console.error('❌ Error en registro:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET no está configurado en las variables de entorno');
      return res.status(500).json({ message: 'Error de configuración del servidor' });
    }

    console.log('🔐 Intento de login para:', email);

    const [user] = await User.findUserByEmail(email);
    if (!user.length) {
      console.log('❌ Usuario no encontrado:', email);
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      console.log('❌ Contraseña incorrecta para:', email);
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { 
        id: user[0].id,
        email: user[0].email,
        name: user[0].name 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    if (!token || token.split('.').length !== 3) {
      console.error('❌ Error: Token JWT no se generó correctamente');
      return res.status(500).json({ message: 'Error generando token de autenticación' });
    }

    console.log('✅ Login exitoso para:', email);
    console.log('🔐 Token JWT generado correctamente');

    // 🔔 ENVIAR NOTIFICACIÓN DE BIENVENIDA
    try {
      await sendWelcomeNotification(user[0].id, user[0].name);
      console.log('🔔 Notificación de bienvenida enviada');
    } catch (notificationError) {
      console.error('⚠️ Error enviando notificación de bienvenida:', notificationError);
      // No fallar el login por error de notificación
    }

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
    console.error('❌ Error en login:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(500).json({ message: 'Error en la generación del token' });
    }
    
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        message: 'Token de acceso requerido',
        valid: false 
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET no está configurado');
      return res.status(500).json({ message: 'Error de configuración del servidor' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log('❌ Token inválido o expirado');
        return res.status(403).json({ 
          message: 'Token inválido o expirado',
          valid: false,
          error: err.name 
        });
      }

      console.log('✅ Token válido para usuario:', user.email);
      res.json({
        message: 'Token válido',
        valid: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    });

  } catch (error) {
    console.error('❌ Error verificando token:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};