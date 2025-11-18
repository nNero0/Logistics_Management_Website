import express from 'express';

import LoTrinhControllers from '../controllers/LoTrinhControllers.js';
import { protect } from '../middleware/authMiddleware.js'; 


const router = express.Router();

router.post('/createlotrinh' ,protect, LoTrinhControllers.CreateLoTrinh);
router.get('/' ,protect, LoTrinhControllers.getAllLoTrinh);
router.delete('/delete/:id' ,protect, LoTrinhControllers.deleteLoTrinh);
export default router;

