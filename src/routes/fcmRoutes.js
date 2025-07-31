import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  updateFCMToken,
  deleteFCMToken,
  getUserFCMTokens,
  sendNotification
} from '../controllers/fcmController.js';
import {
  getNotificationSettings,
  updateNotificationSettings
} from '../controllers/notificationController.js';

const router = Router();

router.use(authenticateToken);

router.post('/fcm-token', updateFCMToken);
router.delete('/fcm-token', deleteFCMToken);
router.get('/fcm-tokens', getUserFCMTokens);

router.post('/send', sendNotification);

router.get('/settings', getNotificationSettings);
router.put('/settings', updateNotificationSettings);

export default router;