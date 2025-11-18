import express from 'express';

import ThongKeController from '../controllers/ThongKeControllers.js';
import { protect } from '../middleware/authMiddleware.js'; 


const router = express.Router();


router.get('/dashboard' ,protect, ThongKeController.getDashboardStats);

export default router;

