import { EstadoPedido } from "@prisma/client";
import prisma from "../lib/prisma";

export const getPedidosService = async () => {
    try {
        // Obtener pedidos con estado "pendiente" y sus relaciones necesarias para cocina
        const pedidos = await prisma.pedido.findMany({
            where: {
                estado: EstadoPedido.pendiente
            },
            include: {
                // Incluir información del cliente (si existe)
                cliente: {
                    select: {
                        id_cliente: true,
                        nombre_completo: true,
                        telefono: true
                    }
                },
                // Incluir información de la mesa
                mesa: {
                    select: {
                        id_mesa: true,
                        nombre_mesa: true,
                        capacidad: true
                    }
                },
                // Incluir información del mesero que tomó el pedido
                mesero: {
                    select: {
                        id_rol: true,
                        nombre_completo: true,
                        nombre_rol: true
                    }
                },
                // Incluir los items del pedido con detalles del menú y bebidas
                items: {
                    include: {
                        menu: {
                            select: {
                                id_menu: true,
                                nombre_plato: true,
                                categoria: true,
                                tiempo_preparacion: true,
                                descripcion: true,
                                precio: true
                            }
                        },
                        bebida: {
                            select: {
                                id_bebida: true,
                                nombre_bebida: true,
                                categoria: true,
                                precio: true,
                                tamano: true
                            }
                        }
                    },
                    orderBy: {
                        id_item_pedido: 'asc'
                    }
                }
            },
            orderBy: {
                fecha_pedido: 'asc' // Ordenar por fecha más antigua primero
            }
        });

        // Formatear la respuesta para que sea más fácil de usar en el frontend
        const pedidosFormateados = pedidos.map(pedido => ({
            id_pedido: pedido.id_pedido,
            numero_pedido: pedido.numero_pedido,
            nombre_cliente: pedido.nombre_cliente || pedido.cliente?.nombre_completo || 'Cliente no registrado',
            mesa: pedido.mesa ? {
                id_mesa: pedido.mesa.id_mesa,
                nombre_mesa: pedido.mesa.nombre_mesa,
                capacidad: pedido.mesa.capacidad
            } : null,
            mesero: pedido.mesero ? {
                id_mesero: pedido.mesero.id_rol,
                nombre_mesero: pedido.mesero.nombre_completo
            } : null,
            estado: pedido.estado,
            total: pedido.total,
            observaciones: pedido.observaciones,
            fecha_pedido: pedido.fecha_pedido,
            items: pedido.items.map(item => ({
                id_item_pedido: item.id_item_pedido,
                tipo: item.id_menu ? 'comida' : 'bebida',
                nombre: item.id_menu ? item.menu?.nombre_plato : item.bebida?.nombre_bebida,
                categoria: item.id_menu ? item.menu?.categoria : item.bebida?.categoria,
                cantidad: item.cantidad,
                precio_unitario: item.precio_unitario,
                subtotal: item.subtotal,
                observaciones: item.observaciones,
                tiempo_preparacion: item.menu?.tiempo_preparacion,
                detalles: item.id_menu ? {
                    descripcion: item.menu?.descripcion
                } : {
                    tamano: item.bebida?.tamano
                }
            }))
        }));

        return {
            status: 200,
            message: "Pedidos pendientes obtenidos correctamente",
            data: pedidosFormateados,
            count: pedidos.length
        };

    } catch (error: any) { // <-- CORRECCIÓN AQUÍ: agregar ': any'
        console.error("Error en getPedidosService:", error);
        return {
            status: 500,
            message: "Error interno del servidor al obtener pedidos",
            data: null,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        };
    }
};