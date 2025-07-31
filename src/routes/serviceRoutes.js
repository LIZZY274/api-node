import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  syncServices,
  syncServicesBatch,
  getSyncStatus,
  confirmSync
} from '../controllers/serviceController.js';

const router = Router();

router.use(authenticateToken);


router.get('/sync', syncServices);              
router.get('/sync/status', getSyncStatus);     
router.post('/sync/batch', syncServicesBatch);  
router.post('/sync/confirm', confirmSync);       


router.get('/', getServices);                    // GET /api/services
router.get('/:id', getService);                  // GET /api/services/:id
router.post('/', createService);                 // POST /api/services
router.put('/:id', updateService);               // PUT /api/services/:id
router.delete('/:id', deleteService);            // DELETE /api/services/:id

export default router;