import express from "express";
import { authenticacionCTRL, newAccountUserCTRL } from "../controller/userControler";


const routerUser = express.Router()

routerUser.post("/auth/login", authenticacionCTRL)
routerUser.post("/auth/new-account", newAccountUserCTRL)


export { routerUser }