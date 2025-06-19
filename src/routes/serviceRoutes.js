import express from 'express';
import * as Service from '../controllers/serviceController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas de servicios requieren autenticación
router.use(authenticateToken);

router.get('/', Service.getAll);
router.get('/:id', Service.getById);
router.post('/', Service.create);
router.put('/:id', Service.update);
router.delete('/:id', Service.remove);

export default router;