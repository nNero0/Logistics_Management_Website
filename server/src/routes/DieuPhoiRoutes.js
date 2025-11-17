import express from 'express';

import DieuPhoiController from '../controllers/DieuPhoiControllers.js';
import { protect } from '../middleware/authMiddleware.js'; 


const router = express.Router();


router.post('/gandon' ,protect, DieuPhoiController.ganDon);


router.post('/hoanthanh' ,protect, DieuPhoiController.hoanThanhChuyen );
router.get('/phancong' ,protect, DieuPhoiController.getAllPhanCong );
export default router;

