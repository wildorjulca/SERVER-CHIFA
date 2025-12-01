import { Request, Response } from 'express'
import { get } from 'http'
import { getAllUsuariosService } from '../service/usuario.Service';

export async function getAllUsuariosCTRL(req: Request, res: Response) {
    try {
        const response = await getAllUsuariosService();
        res.status(response.status).send(response);
    } catch (error) {
        console.error('Error en getAllUsuariosCTRL:', error);
        res.status(500).json({
            success: false,
            status: 500,
            message: 'Error interno del servidor'
        });
    }
}