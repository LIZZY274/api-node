import express from 'express';
import jwt from 'jsonwebtoken'; 
import User from '../models/userModel.js';
import { authenticateToken } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Registro
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Faltan name, email o password' });
  }

  User.findByEmail(email, (err, user) => {
    if (err) return res.status(500).json({ message: err.message });
    if (user) return res.status(400).json({ message: 'Usuario ya existe' });

    User.create(name, email, password, (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      res.status(201).json({ message: 'Usuario registrado correctamente' });
    });
  });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Faltan email o password' });

  User.findByEmail(email, async (err, user) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!user) return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });

    const validPassword = await User.checkPassword(user, password);
    if (!validPassword)
      return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });

   
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login exitoso', token }); 
  });
});

router.get('/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

export default router;
