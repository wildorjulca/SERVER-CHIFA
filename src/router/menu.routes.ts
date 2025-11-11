import express from 'express'
import { getMenuCTRL } from '../controller/menuControler'

const routerMenu = express.Router()



routerMenu.get("/getMenu", getMenuCTRL)

export { routerMenu }