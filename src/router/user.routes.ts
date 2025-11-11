import express from "express";
import { authenticacionCTRL } from "../controller/userControler";


const routerUser = express.Router()

routerUser.post("/auth/login",authenticacionCTRL )


export { routerUser }