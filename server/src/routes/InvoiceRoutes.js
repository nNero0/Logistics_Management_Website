import express from 'express';
import  InvoiceController  from '../controllers/InvoiceControllers.js';

const router = express.Router();


router.post('/', InvoiceController.createInvoice);



export default router;