import express from 'express';

import DonVanController from '../controllers/DonVanControllers.js';
import { protect } from '../middleware/authMiddleware.js'; 


const router = express.Router();


router.post('/createdonvan' ,protect, DonVanController.CreateDonVan);

router.get('/' ,protect, DonVanController.getAllDonVan);
router.delete('/delete/:id' ,protect, DonVanController.deleteDonVan);

export default router;

