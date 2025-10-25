import express from 'express';

import KhachHangControllers from '../controllers/KhachHangControllers.js';
import { protect } from '../middleware/authMiddleware.js'; 


const router = express.Router();


router.post('/createkhachhang' ,protect, KhachHangControllers.CreateKhachHang);

export default router;

