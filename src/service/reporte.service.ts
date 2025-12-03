import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper para obtener fecha del día actual
const getFechaHoy = () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return hoy;
};

// Helper para obtener fecha del mes actual
const getFechaMesActual = () => {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    return inicioMes;
};

// Helper para obtener fecha de la semana actual
const getFechaSemanaActual = () => {
    const hoy = new Date();
    const diaSemana = hoy.getDay(); // 0=Domingo, 1=Lunes...
    const diferencia = diaSemana === 0 ? -6 : 1 - diaSemana; // Si es domingo, retrocede 6 días
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() + diferencia);
    inicioSemana.setHours(0, 0, 0, 0);
    return inicioSemana;
};

// =============================================
// 1. VENTAS DEL DÍA DE HOY
// =============================================
export const getVentasHoyService = async () => {
    try {
        const fechaHoy = getFechaHoy();
        const mañana = new Date(fechaHoy);
        mañana.setDate(mañana.getDate() + 1);

        const ventasHoy = await prisma.pago.aggregate({
            where: {
                pagado: true,
                fecha_pago: {
                    gte: fechaHoy,
                    lt: mañana
                }
            },
            _sum: {
                monto: true
            },
            _count: {
                id_pago: true
            },
            _avg: {
                monto: true
            }
        });

        // Pedidos del día (incluyendo sin pagar)
        const pedidosHoy = await prisma.pedido.findMany({
            where: {
                fecha_pedido: {
                    gte: fechaHoy,
                    lt: mañana
                }
            },
            select: {
                id_pedido: true,
                numero_pedido: true,
                total: true,
                estado: true,
                pago: {
                    select: {
                        pagado: true,
                        metodo_pago: true
                    }
                }
            },
            orderBy: {
                fecha_pedido: 'desc'
            }
        });

        return {
            success: true,
            data: {
                total_ventas: Number(ventasHoy._sum.monto || 0),
                total_transacciones: ventasHoy._count.id_pago,
                promedio_venta: Number(ventasHoy._avg.monto || 0),
                pedidos_hoy: pedidosHoy.map(pedido => ({
                    ...pedido,
                    total: Number(pedido.total),
                    pagado: pedido.pago?.pagado || false,
                    metodo_pago: pedido.pago?.metodo_pago || null
                }))
            }
        };

    } catch (error) {
        console.error('Error en getVentasHoyService:', error);
        throw error;
    }
};

// =============================================
// 2. MÉTODO DE PAGO MÁS USADO
// =============================================
export const getMetodoPagoMasUsadoService = async (periodo: 'hoy' | 'semana' | 'mes' = 'hoy') => {
    try {
        let fechaInicio: Date;

        switch (periodo) {
            case 'hoy':
                fechaInicio = getFechaHoy();
                break;
            case 'semana':
                fechaInicio = getFechaSemanaActual();
                break;
            case 'mes':
                fechaInicio = getFechaMesActual();
                break;
            default:
                fechaInicio = getFechaHoy();
        }

        const metodosPago = await prisma.pago.groupBy({
            by: ['metodo_pago'],
            where: {
                pagado: true,
                fecha_pago: {
                    gte: fechaInicio
                }
            },
            _count: {
                id_pago: true
            },
            _sum: {
                monto: true
            },
            orderBy: {
                _count: {
                    id_pago: 'desc'
                }
            }
        });

        const totalTransacciones = metodosPago.reduce((sum, item) => sum + item._count.id_pago, 0);
        const totalMonto = metodosPago.reduce((sum, item) => sum + Number(item._sum.monto || 0), 0);

        return {
            success: true,
            data: {
                periodo,
                fecha_inicio: fechaInicio,
                total_transacciones: totalTransacciones,
                total_monto: totalMonto,
                metodos: metodosPago.map(item => ({
                    metodo: item.metodo_pago,
                    cantidad: item._count.id_pago,
                    porcentaje: totalTransacciones > 0
                        ? Math.round((item._count.id_pago / totalTransacciones) * 100)
                        : 0,
                    monto_total: Number(item._sum.monto || 0)
                })),
                metodo_mas_usado: metodosPago[0] || null
            }
        };

    } catch (error) {
        console.error('Error en getMetodoPagoMasUsadoService:', error);
        throw error;
    }
};

// =============================================
// 3. PLATOS MÁS VENDIDOS (TOP 10)
// =============================================
export const getPlatosMasVendidosService = async (periodo: 'hoy' | 'semana' | 'mes' = 'hoy') => {
    try {
        let fechaInicio: Date;

        switch (periodo) {
            case 'hoy':
                fechaInicio = getFechaHoy();
                break;
            case 'semana':
                fechaInicio = getFechaSemanaActual();
                break;
            case 'mes':
                fechaInicio = getFechaMesActual();
                break;
            default:
                fechaInicio = getFechaHoy();
        }

        // Platos del menú más vendidos
        const platosMasVendidos = await prisma.itemPedido.groupBy({
            by: ['id_menu'],
            where: {
                id_menu: {
                    not: null
                },
                pedido: {
                    pago: {
                        pagado: true
                    },
                    fecha_pedido: {
                        gte: fechaInicio
                    }
                }
            },
            _sum: {
                cantidad: true,
                subtotal: true
            },
            _count: {
                id_item_pedido: true
            },
            orderBy: {
                _sum: {
                    cantidad: 'desc'
                }
            },
            take: 10
        });

        // Bebidas más vendidas
        const bebidasMasVendidas = await prisma.itemPedido.groupBy({
            by: ['id_bebida'],
            where: {
                id_bebida: {
                    not: null
                },
                pedido: {
                    pago: {
                        pagado: true
                    },
                    fecha_pedido: {
                        gte: fechaInicio
                    }
                }
            },
            _sum: {
                cantidad: true,
                subtotal: true
            },
            _count: {
                id_item_pedido: true
            },
            orderBy: {
                _sum: {
                    cantidad: 'desc'
                }
            },
            take: 10
        });

        // Obtener detalles de los platos
        const platosConDetalles = await Promise.all(
            platosMasVendidos.map(async (item) => {
                const menu = await prisma.menu.findUnique({
                    where: { id_menu: item.id_menu! },
                    select: {
                        nombre_plato: true,
                        categoria: true,
                        precio: true
                    }
                });

                return {
                    tipo: 'menu',
                    id: item.id_menu,
                    nombre: menu?.nombre_plato || 'Plato no encontrado',
                    categoria: menu?.categoria || '',
                    precio_unitario: Number(menu?.precio || 0),
                    cantidad_vendida: item._sum.cantidad || 0,
                    veces_vendido: item._count.id_item_pedido,
                    total_recaudado: Number(item._sum.subtotal || 0)
                };
            })
        );

        // Obtener detalles de las bebidas
        const bebidasConDetalles = await Promise.all(
            bebidasMasVendidas.map(async (item) => {
                const bebida = await prisma.bebida.findUnique({
                    where: { id_bebida: item.id_bebida! },
                    select: {
                        nombre_bebida: true,
                        categoria: true,
                        precio: true
                    }
                });

                return {
                    tipo: 'bebida',
                    id: item.id_bebida,
                    nombre: bebida?.nombre_bebida || 'Bebida no encontrada',
                    categoria: bebida?.categoria || '',
                    precio_unitario: Number(bebida?.precio || 0),
                    cantidad_vendida: item._sum.cantidad || 0,
                    veces_vendido: item._count.id_item_pedido,
                    total_recaudado: Number(item._sum.subtotal || 0)
                };
            })
        );

        return {
            success: true,
            data: {
                periodo,
                fecha_inicio: fechaInicio,
                platos: platosConDetalles,
                bebidas: bebidasConDetalles,
                top_platos: platosConDetalles.slice(0, 5),
                top_bebidas: bebidasConDetalles.slice(0, 5)
            }
        };

    } catch (error) {
        console.error('Error en getPlatosMasVendidosService:', error);
        throw error;
    }
};

// =============================================
// 4. MESAS MÁS UTILIZADAS
// =============================================
export const getMesasMasUtilizadasService = async (periodo: 'hoy' | 'semana' | 'mes' = 'hoy') => {
    try {
        let fechaInicio: Date;

        switch (periodo) {
            case 'hoy':
                fechaInicio = getFechaHoy();
                break;
            case 'semana':
                fechaInicio = getFechaSemanaActual();
                break;
            case 'mes':
                fechaInicio = getFechaMesActual();
                break;
            default:
                fechaInicio = getFechaHoy();
        }

        const mesasUtilizadas = await prisma.pedido.groupBy({
            by: ['id_mesa'],
            where: {
                id_mesa: {
                    not: null
                },
                fecha_pedido: {
                    gte: fechaInicio
                }
            },
            _count: {
                id_pedido: true
            },
            _sum: {
                total: true
            },
            orderBy: {
                _count: {
                    id_pedido: 'desc'
                }
            },
            take: 10
        });

        // Obtener detalles de las mesas
        const mesasConDetalles = await Promise.all(
            mesasUtilizadas.map(async (item) => {
                const mesa = await prisma.mesa.findUnique({
                    where: { id_mesa: item.id_mesa! },
                    select: {
                        nombre_mesa: true,
                        capacidad: true,
                        estado: true
                    }
                });

                return {
                    id_mesa: item.id_mesa,
                    nombre_mesa: mesa?.nombre_mesa || 'Mesa no encontrada',
                    capacidad: mesa?.capacidad || 0,
                    estado: mesa?.estado || 'libre',
                    veces_utilizada: item._count.id_pedido,
                    total_recaudado: Number(item._sum.total || 0),
                    promedio_por_uso: item._count.id_pedido > 0
                        ? Number(item._sum.total || 0) / item._count.id_pedido
                        : 0
                };
            })
        );

        // Estadísticas generales
        const totalMesas = await prisma.mesa.count();
        const mesasOcupadas = await prisma.mesa.count({
            where: { estado: 'ocupada' }
        });

        return {
            success: true,
            data: {
                periodo,
                fecha_inicio: fechaInicio,
                total_mesas: totalMesas,
                mesas_ocupadas: mesasOcupadas,
                porcentaje_ocupacion: totalMesas > 0
                    ? Math.round((mesasOcupadas / totalMesas) * 100)
                    : 0,
                mesas: mesasConDetalles,
                mesa_mas_utilizada: mesasConDetalles[0] || null
            }
        };

    } catch (error) {
        console.error('Error en getMesasMasUtilizadasService:', error);
        throw error;
    }
};

// =============================================
// 5. HORARIOS MÁS ACTIVOS
// =============================================
export const getHorariosMasActivosService = async (periodo: 'hoy' | 'semana' | 'mes' = 'hoy') => {
    try {
        let fechaInicio: Date;

        switch (periodo) {
            case 'hoy':
                fechaInicio = getFechaHoy();
                break;
            case 'semana':
                fechaInicio = getFechaSemanaActual();
                break;
            case 'mes':
                fechaInicio = getFechaMesActual();
                break;
            default:
                fechaInicio = getFechaHoy();
        }

        // Usar raw query para agrupar por hora
        const horariosActivos = await prisma.$queryRaw`
            SELECT 
                HOUR(fecha_pedido) as hora,
                COUNT(*) as cantidad_pedidos,
                SUM(total) as total_ventas
            FROM pedido
            WHERE fecha_pedido >= ${fechaInicio}
            GROUP BY HOUR(fecha_pedido)
            ORDER BY cantidad_pedidos DESC
            LIMIT 10
        `;

        // Estadísticas por franjas horarias
        const franjasHorarias = await prisma.$queryRaw`
            SELECT 
                CASE 
                    WHEN HOUR(fecha_pedido) BETWEEN 6 AND 11 THEN 'Mañana (6:00-11:59)'
                    WHEN HOUR(fecha_pedido) BETWEEN 12 AND 17 THEN 'Tarde (12:00-17:59)'
                    WHEN HOUR(fecha_pedido) BETWEEN 18 AND 23 THEN 'Noche (18:00-23:59)'
                    ELSE 'Madrugada (0:00-5:59)'
                END as franja_horaria,
                COUNT(*) as cantidad_pedidos,
                SUM(total) as total_ventas,
                AVG(total) as promedio_venta
            FROM pedido
            WHERE fecha_pedido >= ${fechaInicio}
            GROUP BY franja_horaria
            ORDER BY cantidad_pedidos DESC
        `;

        return {
            success: true,
            data: {
                periodo,
                fecha_inicio: fechaInicio,
                horarios_activos: horariosActivos,
                franjas_horarias: franjasHorarias,
                hora_pico: Array.isArray(horariosActivos) && horariosActivos.length > 0
                    ? horariosActivos[0]
                    : null
            }
        };

    } catch (error) {
        console.error('Error en getHorariosMasActivosService:', error);
        throw error;
    }
};

// =============================================
// 6. REPORTE POR MESERO
// =============================================
export const getReportePorMeseroService = async (periodo: 'hoy' | 'semana' | 'mes' = 'hoy') => {
    try {
        let fechaInicio: Date;

        switch (periodo) {
            case 'hoy':
                fechaInicio = getFechaHoy();
                break;
            case 'semana':
                fechaInicio = getFechaSemanaActual();
                break;
            case 'mes':
                fechaInicio = getFechaMesActual();
                break;
            default:
                fechaInicio = getFechaHoy();
        }

        // Reporte por mesero
        const reporteMeseros = await prisma.pedido.groupBy({
            by: ['id_mesero'],
            where: {
                id_mesero: {
                    not: null
                },
                fecha_pedido: {
                    gte: fechaInicio
                }
            },
            _count: {
                id_pedido: true
            },
            _sum: {
                total: true
            },
            orderBy: {
                _count: {
                    id_pedido: 'desc'
                }
            }
        });

        // Obtener detalles de los meseros
        const meserosConDetalles = await Promise.all(
            reporteMeseros.map(async (item) => {
                const mesero = await prisma.rol.findUnique({
                    where: { id_rol: item.id_mesero! },
                    select: {
                        nombre_completo: true,
                        nombre_rol: true
                    }
                });

                // Calcular pedidos por estado para este mesero
                const pedidosPorEstado = await prisma.pedido.groupBy({
                    by: ['estado'],
                    where: {
                        id_mesero: item.id_mesero,
                        fecha_pedido: {
                            gte: fechaInicio
                        }
                    },
                    _count: {
                        id_pedido: true
                    }
                });

                // Calcular ventas efectivas (solo pedidos pagados)
                const ventasEfectivas = await prisma.pedido.aggregate({
                    where: {
                        id_mesero: item.id_mesero,
                        pago: {
                            pagado: true
                        },
                        fecha_pedido: {
                            gte: fechaInicio
                        }
                    },
                    _sum: {
                        total: true
                    }
                });

                return {
                    id_mesero: item.id_mesero,
                    nombre_mesero: mesero?.nombre_completo || 'Mesero no encontrado',
                    rol: mesero?.nombre_rol || 'mesero',
                    total_pedidos: item._count.id_pedido,
                    total_ventas: Number(item._sum.total || 0),
                    ventas_efectivas: Number(ventasEfectivas._sum.total || 0),
                    promedio_venta: item._count.id_pedido > 0
                        ? Number(item._sum.total || 0) / item._count.id_pedido
                        : 0,
                    pedidos_por_estado: pedidosPorEstado.map(estado => ({
                        estado: estado.estado,
                        cantidad: estado._count.id_pedido
                    }))
                };
            })
        );

        // Estadísticas generales
        const totalMeseros = await prisma.rol.count({
            where: { nombre_rol: 'mesero' }
        });

        const totalVentasMeseros = meserosConDetalles.reduce(
            (sum, mesero) => sum + mesero.total_ventas, 0
        );

        return {
            success: true,
            data: {
                periodo,
                fecha_inicio: fechaInicio,
                total_meseros: totalMeseros,
                total_ventas_meseros: totalVentasMeseros,
                meseros: meserosConDetalles,
                mesero_destacado: meserosConDetalles[0] || null
            }
        };

    } catch (error) {
        console.error('Error en getReportePorMeseroService:', error);
        throw error;
    }
};

// =============================================
// 7. REPORTE COMPLETO DEL DÍA
// =============================================
export const getReporteCompletoHoyService = async () => {
    try {
        const fechaHoy = getFechaHoy();
        const mañana = new Date(fechaHoy);
        mañana.setDate(mañana.getDate() + 1);

        // Ejecutar todas las consultas en paralelo
        const [
            ventasHoy,
            metodosPago,
            platosVendidos,
            mesasUtilizadas,
            horariosActivos,
            reporteMeseros
        ] = await Promise.all([
            getVentasHoyService().catch(() => ({ data: { total_ventas: 0 } })),
            getMetodoPagoMasUsadoService('hoy').catch(() => ({ data: [] })),
            getPlatosMasVendidosService('hoy').catch(() => ({ data: [] })),
            getMesasMasUtilizadasService('hoy').catch(() => ({ data: [] })),
            getHorariosMasActivosService('hoy').catch(() => ({ data: { horarios_activos: [] } })),
            getReportePorMeseroService('hoy').catch(() => ({ data: [] }))
        ]);


        // Total pedidos hoy
        const totalPedidosHoy = await prisma.pedido.count({
            where: {
                fecha_pedido: {
                    gte: fechaHoy,
                    lt: mañana
                }
            }
        });

        // Pedidos por estado hoy
        const pedidosPorEstado = await prisma.pedido.groupBy({
            by: ['estado'],
            where: {
                fecha_pedido: {
                    gte: fechaHoy,
                    lt: mañana
                }
            },
            _count: {
                id_pedido: true
            }
        });

        // Ticket promedio hoy
        const ventasPagadas = await prisma.pago.aggregate({
            where: {
                pagado: true,
                fecha_pago: {
                    gte: fechaHoy,
                    lt: mañana
                }
            },
            _avg: {
                monto: true
            }
        });

        return {
            success: true,
            data: {
                fecha: fechaHoy,
                total_pedidos: totalPedidosHoy,
                total_ventas: ventasHoy.data?.total_ventas || 0,
                ticket_promedio: Number(ventasPagadas._avg.monto || 0),
                pedidos_por_estado: pedidosPorEstado,
                metodos_pago: metodosPago.data,
                platos_mas_vendidos: platosVendidos.data,
                mesas_mas_utilizadas: mesasUtilizadas.data,
                horarios_activos: horariosActivos.data,
                reporte_meseros: reporteMeseros.data,
                resumen: {
                    clientes_atendidos: await prisma.pedido.count({
                        where: {
                            fecha_pedido: {
                                gte: fechaHoy,
                                lt: mañana
                            }
                        },
                        // distinct: ['id_cliente']
                    }),
                    mesas_ocupadas: await prisma.mesa.count({
                        where: { estado: 'ocupada' }
                    }),
                    hora_pico: Array.isArray(horariosActivos.data?.horarios_activos) &&
                        horariosActivos.data?.horarios_activos.length > 0
                        ? horariosActivos.data.horarios_activos[0]
                        : null
                }
            }
        };

    } catch (error) {
        console.error('Error en getReporteCompletoHoyService:', error);
        throw error;
    }
};

// =============================================
// 8. REPORTE POR RANGO DE FECHAS
// =============================================
export const getReportePorRangoFechasService = async (
    fechaInicio: Date,
    fechaFin: Date
) => {
    try {
        // Ajustar fechaFin para incluir todo el día
        const fechaFinAjustada = new Date(fechaFin);
        fechaFinAjustada.setHours(23, 59, 59, 999);

        // Ventas totales en el rango
        const ventasRango = await prisma.pago.aggregate({
            where: {
                pagado: true,
                fecha_pago: {
                    gte: fechaInicio,
                    lte: fechaFinAjustada
                }
            },
            _sum: {
                monto: true
            },
            _count: {
                id_pago: true
            },
            _avg: {
                monto: true
            }
        });

        // Pedidos en el rango
        const pedidosRango = await prisma.pedido.findMany({
            where: {
                fecha_pedido: {
                    gte: fechaInicio,
                    lte: fechaFinAjustada
                }
            },
            include: {
                mesa: {
                    select: {
                        nombre_mesa: true
                    }
                },
                mesero: {
                    select: {
                        nombre_completo: true
                    }
                },
                pago: {
                    select: {
                        metodo_pago: true,
                        pagado: true
                    }
                }
            },
            orderBy: {
                fecha_pedido: 'desc'
            }
        });

        // Ventas por día en el rango
        const ventasPorDia = await prisma.$queryRaw`
            SELECT 
                DATE(fecha_pago) as fecha,
                COUNT(*) as cantidad_transacciones,
                SUM(monto) as total_ventas,
                AVG(monto) as promedio_diario
            FROM pago
            WHERE pagado = true 
                AND fecha_pago >= ${fechaInicio}
                AND fecha_pago <= ${fechaFinAjustada}
            GROUP BY DATE(fecha_pago)
            ORDER BY fecha
        `;

        return {
            success: true,
            data: {
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFinAjustada,
                total_ventas: Number(ventasRango._sum.monto || 0),
                total_transacciones: ventasRango._count.id_pago,
                promedio_transaccion: Number(ventasRango._avg.monto || 0),
                ventas_por_dia: ventasPorDia,
                pedidos: pedidosRango.map(pedido => ({
                    ...pedido,
                    total: Number(pedido.total)
                }))
            }
        };

    } catch (error) {
        console.error('Error en getReportePorRangoFechasService:', error);
        throw error;
    }
};