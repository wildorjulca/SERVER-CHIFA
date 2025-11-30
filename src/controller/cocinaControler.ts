import { Request, Response } from 'express'
import { getPedidosService } from '../service/cocina.Service'

export async function getPedidosCocinaController(req: Request, res: Response) {
    try {
        const response = await getPedidosService()
        
        // Enviar respuesta estructurada
        res.status(response.status).json({
            success: response.status === 200,
            message: response.message,
            data: response.data,
            count: response.count,
            ...(response.error && { error: response.error })
        });
        
    } catch (error) {
        console.error("Error en getPedidosCocinaController:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del controlador",
            data: null
        });
    }
}