import express from 'express';

import KhoBaiControllers from '../controllers/KhoBaiControllers.js';
import { protect } from '../middleware/authMiddleware.js'; 


const router = express.Router();

router.post('/createkhobai' ,protect, KhoBaiControllers.CreateKhoBai);
router.get('/' ,protect, KhoBaiControllers.fetchKhoBai);
router.delete('/delete/:id' ,protect, KhoBaiControllers.deleteKhoBai);

export default router;

