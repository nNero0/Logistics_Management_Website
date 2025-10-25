import express from 'express';

import PhuongTienControllers from '../controllers/PhuongTienControllers.js';
import { protect } from '../middleware/authMiddleware.js'; 


const router = express.Router();

router.get('/getphuongtien',protect, PhuongTienControllers.getAllPhuongTien);

router.post('/createphuongtien' ,protect, PhuongTienControllers.CreatePhuongTien);

export default router;

