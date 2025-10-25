import express from 'express';
import shipmentsControllers from '../controllers/shipmentsControllers.js';


const router = express.Router();

router.post('/myshipments', shipmentsController.getMyShipments);

router.post('/createshipments',authController.CreateShipments);

export default router;
