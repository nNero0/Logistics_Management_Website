import express from 'express';
import  InvoiceController  from '../controllers/InvoiceControllers.js';
import DieuPhoiController from '../controllers/DieuPhoiControllers.js';
import { protect } from '../middleware/authMiddleware.js'; 


const router = express.Router();


router.post('/gandon' ,protect, DieuPhoiController.ganDon);


router.post('/hoanthanh' ,protect, DieuPhoiController.hoanThanhChuyen );
router.get('/phancong' ,protect, DieuPhoiController.getAllPhanCong );
router.post('/invoice',protect, InvoiceController.createInvoice);
export default router;

