import { Request, Response } from 'express';
import { processPaymentService } from '../service/pago.Service';

const processPaymentCTRL = async (req: Request, res: Response) => {
    const body = req.body;
    const response = await processPaymentService(body)
    res.status(response.status).send(response)
}
export { processPaymentCTRL }