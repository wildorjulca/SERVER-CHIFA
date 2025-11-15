import express from "express";
import { getAllUsuariosCTRL } from "../controller/usuarioControler";

const routerUsuario = express.Router()

routerUsuario.get("/getAllUsuarios", getAllUsuariosCTRL)

export { routerUsuario }    