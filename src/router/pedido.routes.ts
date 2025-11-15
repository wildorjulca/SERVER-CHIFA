import express from 'express'
import { crearPedido, footerReportePedidos, pedidosDetallesPorPagar } from '../controller/pedidoControler'

const routerPedido = express.Router()

routerPedido.post("/savePedido", crearPedido)
routerPedido.get("/getPedidosDetallesPorPagar", pedidosDetallesPorPagar)
routerPedido.get("/getFooterReporte", footerReportePedidos)


export { routerPedido }