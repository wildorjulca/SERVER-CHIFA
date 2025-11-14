import { Request, Response } from 'express'
import { crearPedidoCompletoService } from '../service/pedido.Service';
// =====================================================
// CREAR PEDIDO COMPLETO CON ITEMS
// =====================================================
export async function crearPedido(req: Request, res: Response) {
    try {
        const { id_mesa, id_mesero, id_cliente, nombre_cliente, observaciones, items } = req.body;

        // if (!id_mesa || !id_mesero || !nombre_cliente || !items || !Array.isArray(items)) {
        if (!id_mesa || !id_mesero ||  !items || !Array.isArray(items)) {
            return res.status(400).json({
                error: 'id_mesa, id_mesero, nombre_cliente y items (array) son requeridos'
            });
        }

        if (items.length === 0) {
            return res.status(400).json({
                error: 'El pedido debe tener al menos un item'
            });
        }

        const resultado = await crearPedidoCompletoService({
            id_mesa: parseInt(id_mesa),
            id_mesero: parseInt(id_mesero),
            id_cliente: id_cliente ? parseInt(id_cliente) : undefined,
            nombre_cliente,
            observaciones,
            items
        });

        res.status(201).json({
            mensaje: 'Pedido creado exitosamente con todos los items',
            ...resultado
        });
    } catch (error) {
        console.error('Error crearPedido controller:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
