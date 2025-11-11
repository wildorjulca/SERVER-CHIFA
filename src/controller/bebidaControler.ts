import { Request, Response } from "express";
import { getMenuService } from "../service/menu.Service";
import { getBebidaService } from "../service/bebida.Service";

const getBebidaCTRL = async (req: Request, res: Response) => {
    const response = await getBebidaService()
    res.status(response.status).send(response)
}

export { getBebidaCTRL }