import express from 'express';

import TaiXeControllers from '../controllers/TaiXeControllers.js';
import { protect } from '../middleware/authMiddleware.js'; 


const router = express.Router();

router.post('/createtaixe' ,protect, TaiXeControllers.CreateTaiXe);


export default router;

