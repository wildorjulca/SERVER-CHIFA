import { Request, Response } from "express";
import { autenticacionService } from "../service/userService";
import { getMenuService } from "../service/menu.Service";

const getMenuCTRL = async (req: Request, res: Response) => {
    const response = await getMenuService()
    res.status(response.status).send(response)
}

export { getMenuCTRL }