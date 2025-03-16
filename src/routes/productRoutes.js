import express from 'express';
import { createProduct, getUserProducts, deleteProduct } from '../controllers/productController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/products', authenticateToken, createProduct);  // Crear producto
router.get('/products', authenticateToken, getUserProducts);  // Obtener productos del usuario
router.delete('/products/:id', authenticateToken, deleteProduct);  // Eliminar producto

export default router;
