import express from 'express';

import HangHoaControllers from '../controllers/HangHoaControllers.js';
import { protect } from '../middleware/authMiddleware.js'; 


const router = express.Router();


router.post('/createhanghoa' ,protect, HangHoaControllers.CreateHangHoa);
router.delete('/delete/:id' ,protect, HangHoaControllers.deleteHangHoa);
router.get('/' ,protect, HangHoaControllers.getAllHangHoa);
export default router;

