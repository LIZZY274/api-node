import express from 'express';
import { testRegex } from '../controllers/regexController.js';

const router = express.Router();

router.post('/test', testRegex);

export default router;
