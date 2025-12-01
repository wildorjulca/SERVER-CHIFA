import express from 'express'
import { getPedidosCocinaController } from '../controller/cocinaControler'

const routerCocina = express.Router()

routerCocina.get("/getPedidosCocina", getPedidosCocinaController)


export { routerCocina }