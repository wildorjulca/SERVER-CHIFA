import express from "express";
import cors from 'cors'
import { routerUser } from "./router/user.routes";
import { routerMenu } from "./router/menu.routes";
import { routerBebida } from "./router/bebida.routes";
import { routerMesa } from "./router/mesa.routes";
import { routerPedido } from "./router/pedido.routes";
import { routerUsuario } from "./router/usuario.routes";
import { routerCocina } from "./router/cocina.routes";


const app = express()

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json())

app.use("/api", routerUser);
app.use("/api", routerMenu)
app.use("/api", routerBebida)
app.use("/api", routerMesa)
app.use("/api", routerPedido)
app.use("/api", routerUsuario)
app.use("/api", routerCocina)

app.listen(3110, () => {
  console.log(`SERVIDOR EN EJECUCION http://localhost:3110`)
})