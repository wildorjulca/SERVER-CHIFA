import { Request, Response } from "express";
import { autenticacionService } from "../service/userService";

const authenticacionCTRL = async (req: Request, res: Response) => {
    const { correo, clave } = req.body
    const response = await autenticacionService(correo as string, clave as string)
    res.status(response.status).send(response)
}

export { authenticacionCTRL }