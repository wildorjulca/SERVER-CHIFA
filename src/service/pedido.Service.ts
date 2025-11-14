// =====================================================
// CREAR PEDIDO COMPLETO CON ITEMS
//  ====================================================


import prisma from "../lib/prisma";

// =====================================================
export async function crearPedidoCompletoService(data: {
    id_mesa: number;
    id_mesero: number;
    id_cliente?: number;
    nombre_cliente?: string;
    observaciones?: string;
    items: Array<{
        id_menu?: number;
        id_bebida?: number;
        cantidad: number;
        precio_unitario: number;
        observaciones?: string;
    }>;
}) {
    const numeroPedido = `PED-${Date.now()}`;

    return await prisma.$transaction(async (tx) => {
        // Calcular total sumando todos los items
        const total = data.items.reduce((sum, item) => {
            return sum + (item.cantidad * item.precio_unitario);
        }, 0);

        // 1. Crear el pedido con el total calculado
        const pedido = await tx.pedido.create({
            data: {
                numero_pedido: numeroPedido,
                id_mesa: data.id_mesa,
                id_mesero: data.id_mesero,
                id_cliente: data.id_cliente,
                nombre_cliente: data.nombre_cliente || "cliente al paso",
                estado: 'pendiente',
                total: total,
                observaciones: data.observaciones
            }
        });

        // 2. Crear todos los items del pedido
        const itemsCreados = await Promise.all(
            data.items.map(item =>
                tx.itemPedido.create({
                    data: {
                        id_pedido: pedido.id_pedido,
                        id_menu: item.id_menu,
                        id_bebida: item.id_bebida,
                        cantidad: item.cantidad,
                        precio_unitario: item.precio_unitario,
                        subtotal: item.cantidad * item.precio_unitario,
                        observaciones: item.observaciones
                    },
                    include: {
                        menu: true,
                        bebida: true
                    }
                })
            )
        );

        // 3. Actualizar estado de la mesa
        await tx.mesa.update({
            where: { id_mesa: data.id_mesa },
            data: { estado: 'ocupada' }
        });

        return {
            ok: true,
            status: 201,
            message: "Pedido Creado correctamente",
            pedido,
            items: itemsCreados,
            total
        };
    });
}
