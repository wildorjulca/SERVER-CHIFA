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

export const getPedidosDetallesPorPagarService = async () => {
    try {
        const pedidos = await prisma.pedido.findMany({
            where: {
                OR: [
                    { pago: null },
                    { pago: { pagado: false } }
                ],
                estado: {
                    in: ['preparado', 'entregado']
                }
            },
            include: {
                mesa: {
                    select: {
                        id_mesa: true,
                        nombre_mesa: true,
                        capacidad: true,
                        estado: true
                    }
                },
                mesero: {
                    select: {
                        id_rol: true,
                        nombre_completo: true,
                        nombre_rol: true
                    }
                },
                cliente: {
                    select: {
                        id_cliente: true,
                        nombre_completo: true,
                        telefono: true
                    }
                },
                items: {
                    include: {
                        menu: {
                            select: {
                                id_menu: true,
                                nombre_plato: true,
                                categoria: true,
                                precio: true
                            }
                        },
                        bebida: {
                            select: {
                                id_bebida: true,
                                nombre_bebida: true,
                                categoria: true,
                                precio: true
                            }
                        }
                    }
                },
                pago: {
                    select: {
                        id_pago: true,
                        metodo_pago: true,
                        monto: true,
                        monto_recibido: true,
                        cambio: true,
                        pagado: true,
                        fecha_pago: true
                    }
                }
            },
            orderBy: [
                { estado: 'asc' }, // Primero los 'preparado', luego 'entregado'
                { fecha_pedido: 'desc' }
            ]
        });

        // Transformar los datos
        const pedidosTransformados = pedidos.map(pedido => {
            const nombreCliente = pedido.nombre_cliente ||
                pedido.cliente?.nombre_completo ||
                'Cliente no registrado';

            // Calcular total desde items como verificación
            const totalCalculado = pedido.items.reduce((sum, item) => {
                return sum + Number(item.subtotal);
            }, 0);

            return {
                id_pedido: pedido.id_pedido,
                numero_pedido: pedido.numero_pedido,
                nombre_cliente: nombreCliente,
                estado: pedido.estado,
                total: Number(pedido.total),
                total_calculado: totalCalculado, // Para verificación
                fecha_pedido: pedido.fecha_pedido,
                fecha_entrega: pedido.fecha_entrega,
                observaciones: pedido.observaciones,

                // Relaciones
                mesa: pedido.mesa,
                mesero: pedido.mesero,
                cliente: pedido.cliente,

                items: pedido.items.map(item => ({
                    id_item_pedido: item.id_item_pedido,
                    cantidad: item.cantidad,
                    precio_unitario: Number(item.precio_unitario),
                    subtotal: Number(item.subtotal),
                    observaciones: item.observaciones,
                    producto: item.menu ? {
                        tipo: 'menu',
                        id: item.menu.id_menu,
                        nombre: item.menu.nombre_plato,
                        categoria: item.menu.categoria,
                        precio_actual: Number(item.menu.precio)
                    } : item.bebida ? {
                        tipo: 'bebida',
                        id: item.bebida.id_bebida,
                        nombre: item.bebida.nombre_bebida,
                        categoria: item.bebida.categoria,
                        precio_actual: Number(item.bebida.precio)
                    } : null
                })),

                pago: pedido.pago ? {
                    ...pedido.pago,
                    monto: Number(pedido.pago.monto),
                    monto_recibido: pedido.pago.monto_recibido ?
                        Number(pedido.pago.monto_recibido) : null,
                    cambio: pedido.pago.cambio ?
                        Number(pedido.pago.cambio) : null
                } : null
            };
        });

        // Estadísticas para el response
        const estadisticas = {
            total_pedidos: pedidosTransformados.length,
            total_a_cobrar: pedidosTransformados.reduce((sum, pedido) =>
                sum + pedido.total, 0),
            por_estado: {
                preparado: pedidosTransformados.filter(p => p.estado === 'preparado').length,
                entregado: pedidosTransformados.filter(p => p.estado === 'entregado').length
            }
        };

        return {
            success: true,
            status: 200,
            message: `${pedidosTransformados.length} pedidos por pagar encontrados`,
            data: {
                pedidos: pedidosTransformados,
                estadisticas: estadisticas
            }
        };

    } catch (error) {
        console.error('Error en getPedidosDetallesPorPagarService:', error);

        return {
            success: false,
            status: 500,
            message: "Error interno del servidor al obtener pedidos por pagar",
            error: process.env.NODE_ENV === 'development' ?
                (error instanceof Error ? error.message : 'Error desconocido')
                : undefined
        };
    }
};

export const getFooterReportePedidosService = async () => {
    try {

        // Obtener rango del día
        const inicioDia = new Date();
        inicioDia.setHours(0, 0, 0, 0);

        const finDia = new Date();
        finDia.setHours(23, 59, 59, 999);

        // -------------------------------
        // 1. Pedidos por cobrar (no pagados)
        // -------------------------------
        const pedidosPorCobrar = await prisma.pago.count({
            where: {
                pagado: false,
                fecha_pago: {
                    gte: inicioDia,
                    lte: finDia
                }
            }
        });
        const pedidosPagados = await prisma.pago.count({
            where: {
                pagado: true,
                fecha_pago: {
                    gte: inicioDia,
                    lte: finDia
                }
            }
        });
        const totalPendiente = await prisma.pago.aggregate({
            _sum: {
                monto: true
            },
            where: {
                pagado: false,
                fecha_pago: {
                    gte: inicioDia,
                    lte: finDia
                }
            }
        });

        return {
            status: 200,
            success: true,
            data: {
                pedidosPorCobrar,
                pedidosPagados,
                totalPendiente: totalPendiente._sum.monto ?? 0
            }
        };

    } catch (error) {
        console.error("Error en getFooterReportePedidosService:", error);
        return {
            status: 500,
            success: false,
            message: "Error al generar el footer del reporte"
        }
    }
}