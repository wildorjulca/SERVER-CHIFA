import express from 'express';
import { processPaymentCTRL } from '../controller/pagoController';
const routerPago = express.Router();

routerPago.post('/processPayment', processPaymentCTRL)

export { routerPago }