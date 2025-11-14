import express from 'express'
import { mesaCTRL } from '../controller/mesaControler'


const routerMesa = express.Router()

routerMesa.get("/getMesa", mesaCTRL)

export { routerMesa }