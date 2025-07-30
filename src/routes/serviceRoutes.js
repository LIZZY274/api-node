// routes/serviceRoutes.js - COMPLETO con sincronización
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

// ============================================
// RUTAS DE SINCRONIZACIÓN (NUEVAS)
// ============================================
router.get('/sync', syncServices);               // GET /api/services/sync?lastSync=timestamp
router.get('/sync/status', getSyncStatus);       // GET /api/services/sync/status?lastSync=timestamp
router.post('/sync/batch', syncServicesBatch);   // POST /api/services/sync/batch
router.post('/sync/confirm', confirmSync);       // POST /api/services/sync/confirm

// ============================================
// RUTAS PRINCIPALES (EXISTENTES)
// ============================================
router.get('/', getServices);                    // GET /api/services
router.get('/:id', getService);                  // GET /api/services/:id
router.post('/', createService);                 // POST /api/services
router.put('/:id', updateService);               // PUT /api/services/:id
router.delete('/:id', deleteService);            // DELETE /api/services/:id

export default router;