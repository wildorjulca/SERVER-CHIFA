import { Request, Response } from 'express';
import {
    getVentasHoyService,
    getMetodoPagoMasUsadoService,
    getPlatosMasVendidosService,
    getMesasMasUtilizadasService,
    getHorariosMasActivosService,
    getReportePorMeseroService,
    getReporteCompletoHoyService,
    getReportePorRangoFechasService
} from '../service/reporte.service';

export class ReporteController {
    // 1. Ventas del día de hoy
    static getVentasHoy = async (req: Request, res: Response) => {
        try {
            const result = await getVentasHoyService();
            res.json(result);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener ventas del día'
            });
        }
    };

    // 2. Método de pago más usado
    static getMetodoPagoMasUsado = async (req: Request, res: Response) => {
        try {
            const { periodo = 'hoy' } = req.query;
            const result = await getMetodoPagoMasUsadoService(periodo as any);
            res.json(result);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener métodos de pago'
            });
        }
    };

    // 3. Platos más vendidos
    static getPlatosMasVendidos = async (req: Request, res: Response) => {
        try {
            const { periodo = 'hoy' } = req.query;
            const result = await getPlatosMasVendidosService(periodo as any);
            res.json(result);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener platos más vendidos'
            });
        }
    };

    // 4. Mesas más utilizadas
    static getMesasMasUtilizadas = async (req: Request, res: Response) => {
        try {
            const { periodo = 'hoy' } = req.query;
            const result = await getMesasMasUtilizadasService(periodo as any);
            res.json(result);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener mesas más utilizadas'
            });
        }
    };

    // 5. Horarios más activos
    static getHorariosMasActivos = async (req: Request, res: Response) => {
        try {
            const { periodo = 'hoy' } = req.query;
            const result = await getHorariosMasActivosService(periodo as any);
            res.json(result);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener horarios más activos'
            });
        }
    };

    // 6. Reporte por mesero
    static getReportePorMesero = async (req: Request, res: Response) => {
        try {
            const { periodo = 'hoy' } = req.query;
            const result = await getReportePorMeseroService(periodo as any);
            res.json(result);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener reporte por mesero'
            });
        }
    };


    // 7. Reporte completo del día
    static getReporteCompletoHoy = async (req: Request, res: Response) => {

        const cleanBigInt = (obj: any) =>
            JSON.parse(
                JSON.stringify(
                    obj,
                    (_, value) => typeof value === 'bigint' ? Number(value) : value
                )
            );

        try {
            const result = await getReporteCompletoHoyService();
            res.json(cleanBigInt(result));
        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                message: 'Error al obtener reporte completo'
            });
        }
    };

    // 8. Reporte por rango de fechas
    static getReportePorRangoFechas = async (req: Request, res: Response) => {
        try {
            const { fechaInicio, fechaFin } = req.query;

            if (!fechaInicio || !fechaFin) {
                return res.status(400).json({
                    success: false,
                    message: 'Se requieren fechaInicio y fechaFin'
                });
            }

            const inicio = new Date(fechaInicio as string);
            const fin = new Date(fechaFin as string);

            const result = await getReportePorRangoFechasService(inicio, fin);
            res.json(result);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener reporte por rango de fechas'
            });
        }
    };
}