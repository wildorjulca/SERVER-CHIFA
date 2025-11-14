import express from 'express'
import { crearPedido } from '../controller/pedidoControler'

const routerPedido = express.Router()

routerPedido.post("/savePedido", crearPedido)


export { routerPedido }