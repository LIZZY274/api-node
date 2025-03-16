import express from 'express';
import { createUser, getAllUsers, deleteUser, loginUser, profileHandler, registerUser } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/users', authenticateToken, getAllUsers);
router.delete('/users/:id', authenticateToken, deleteUser);
router.get('/profile', authenticateToken, profileHandler);


export default router;
