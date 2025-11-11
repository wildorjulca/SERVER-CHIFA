import express from 'express'
import { getBebidaCTRL } from '../controller/bebidaControler'


const routerBebida = express.Router()

routerBebida.get("/getBebida", getBebidaCTRL)

export { routerBebida }