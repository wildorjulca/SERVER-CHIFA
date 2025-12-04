import express from "express";
import dotenv from "dotenv";
import cors from 'cors'
import { routerUser } from "./router/user.routes";
import { routerMenu } from "./router/menu.routes";
import { routerBebida } from "./router/bebida.routes";
import { routerMesa } from "./router/mesa.routes";
import { routerPedido } from "./router/pedido.routes";
import { routerUsuario } from "./router/usuario.routes";
import { routerCocina } from "./router/cocina.routes";
import { routerPago } from "./router/pago.routes";
import { routerReportes } from "./router/reporte.routes";

dotenv.config();

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
app.use("/api", routerPago)
app.use('/api/reportes', routerReportes);


app.listen(3110, '0.0.0.0', () => {
  console.log(`SERVIDOR EN EJECUCION http://localhost:3110`)
})