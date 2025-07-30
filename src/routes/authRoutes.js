import express from 'express';
import { register, login, verifyToken } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.post('/register', register);
router.post('/login', login);

// Ruta protegida para verificar token
router.get('/verify', authenticateToken, verifyToken);

export default router;