import { Router } from 'express';
import { ReporteController } from '../controller/reporteControler';

const routerReportes = Router();

// Ventas del día de hoy
routerReportes.get('/ventas-hoy', ReporteController.getVentasHoy);

// Método de pago más usado
routerReportes.get('/metodo-pago-mas-usado', ReporteController.getMetodoPagoMasUsado);

// Platos más vendidos (TOP 10)
routerReportes.get('/platos-mas-vendidos', ReporteController.getPlatosMasVendidos);

// Mesas más utilizadas
routerReportes.get('/mesas-mas-utilizadas', ReporteController.getMesasMasUtilizadas);

// Horarios más activos
routerReportes.get('/horarios-activos', ReporteController.getHorariosMasActivos);

// Reporte por mesero
routerReportes.get('/reporte-meseros', ReporteController.getReportePorMesero);

// Reporte completo del día
routerReportes.get('/reporte-completo-hoy', ReporteController.getReporteCompletoHoy);

// Reporte por rango de fechas
routerReportes.get('/reporte-rango-fechas', ReporteController.getReportePorRangoFechas);

export { routerReportes };