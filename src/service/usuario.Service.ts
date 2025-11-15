// =====================================================
// CREAR PEDIDO COMPLETO CON ITEMS
//  ====================================================


import prisma from "../lib/prisma";

// =====================================================


export const getAllUsuariosService = async () => {
    try {
        const usuarios = await prisma.rol.findMany({
            include: {
                pedidos_atendidos: {
                    select: {
                        id_pedido: true
                    }
                },
                pagos_registrados: {
                    select: {
                        id_pago: true
                    }
                }
            },
            orderBy: {
                creado_en: 'desc'
            }
        });

        // Transformar datos para incluir estadísticas
        const usuariosTransformados = usuarios.map(usuario => ({
            id_rol: usuario.id_rol,
            nombre_completo: usuario.nombre_completo,
            nombre_rol: usuario.nombre_rol,
            correo: usuario.correo,
            activo: usuario.activo,
            creado_en: usuario.creado_en,
            estadisticas: {
                total_pedidos: usuario.pedidos_atendidos.length,
                total_pagos: usuario.pagos_registrados.length
            }
        }));

        // Estadísticas generales
        const estadisticas = {
            total_usuarios: usuarios.length,
            usuarios_activos: usuarios.filter(u => u.activo).length,
            por_rol: {
                admin: usuarios.filter(u => u.nombre_rol === 'admin').length,
                mesero: usuarios.filter(u => u.nombre_rol === 'mesero').length,
                cajero: usuarios.filter(u => u.nombre_rol === 'cajero').length,
                cocinero: usuarios.filter(u => u.nombre_rol === 'cocinero').length
            }
        };

        return {
            success: true,
            status: 200,
            message: `${usuarios.length} usuarios encontrados`,
            data: {
                usuarios: usuariosTransformados,
                estadisticas
            }
        };

    } catch (error) {
        console.error('Error en getAllUsuariosService:', error);
        return {
            success: false,
            status: 500,
            message: "Error interno del servidor al obtener usuarios",
            error: process.env.NODE_ENV === 'development'
                ? (error instanceof Error ? error.message : 'Error desconocido')
                : undefined
        };
    }
};