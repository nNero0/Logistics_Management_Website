import express from 'express';

import PhuongTienControllers from '../controllers/PhuongTienControllers.js';
import { protect } from '../middleware/authMiddleware.js'; 


const router = express.Router();

router.get('/',protect, PhuongTienControllers.getAllPhuongTien);

router.post('/createphuongtien' ,protect, PhuongTienControllers.CreatePhuongTien);
router.delete("/delete/:id", protect, PhuongTienControllers.deletePhuongTien);

export default router;

