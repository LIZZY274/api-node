import express from 'express';
import * as serviceController from '../controllers/serviceController.js';
import { validateServiceInput } from '../middleware/validateServiceInput.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, validateServiceInput, serviceController.createService);
router.get('/', authenticateToken, serviceController.getUserServices);
router.put('/:id', authenticateToken, validateServiceInput, serviceController.updateService);
router.delete('/:id', authenticateToken, serviceController.deleteService);


export default router;
