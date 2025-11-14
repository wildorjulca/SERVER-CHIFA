import { Request, Response } from "express";
import { getMesaService } from "../service/mesa.Service";

const mesaCTRL = async (req: Request, res: Response) => {
    const response = await getMesaService()
    res.status(response.status).send(response)
}

export { mesaCTRL }