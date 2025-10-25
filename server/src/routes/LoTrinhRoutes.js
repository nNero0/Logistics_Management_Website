import express from 'express';

import LoTrinhControllers from '../controllers/LoTrinhControllers.js';
import { protect } from '../middleware/authMiddleware.js'; 


const router = express.Router();

router.post('/lotrinh/createlotrinh' ,protect, LoTrinhControllers.CreateLoTrinh);


export default router;

