// seed.js
const { PrismaClient } = require('@prisma/client');
// const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando inserción de datos...');

  // 1. Insertar roles (empleados del restaurante)
  console.log('👥 Insertando roles...');
  const roles = await prisma.rol.createMany({
    data: [
      {
        nombre_completo: 'Administrador Principal',
        nombre_rol: 'admin',
        correo: 'admin@chifa.com',
        clave: '$2a$10$KxG5.5P2Q7U8Q2Q2Q2Q2Q2uQ2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q2', // admin123
        activo: true,
      },
      {
        nombre_completo: 'Carlos Mendoza - Cajero',
        nombre_rol: 'cajero',
        correo: 'cajero@chifa.com',
        clave: '$2a$10$KxG5.5P2Q7U8Q2Q2Q2Q2Q2uQ2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q2', // cajero123
        activo: true,
      },
      {
        nombre_completo: 'María López - Mesera',
        nombre_rol: 'mesero',
        correo: 'mesero@chifa.com',
        clave: '$2a$10$KxG5.5P2Q7U8Q2Q2Q2Q2Q2uQ2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q2', // mesero123
        activo: true,
      },
      {
        nombre_completo: 'Chef Wong - Cocinero',
        nombre_rol: 'cocinero',
        correo: 'chef@chifa.com',
        clave: '$2a$10$KxG5.5P2Q7U8Q2Q2Q2Q2Q2uQ2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q2Q2', // chef123
        activo: true,
      }
    ],
    skipDuplicates: true,
  });

  // 2. Insertar clientes
  console.log('👨‍👩‍👧‍👦 Insertando clientes...');
  const clientes = await prisma.cliente.createMany({
    data: [
      {
        nombre_completo: 'Juan Pérez García',
        telefono: '+51987654321',
        correo: 'juan.perez@email.com',
      },
      {
        nombre_completo: 'María López Soto',
        telefono: '+51987654322',
        correo: 'maria.lopez@email.com',
      },
      {
        nombre_completo: 'Carlos Rodríguez',
        telefono: '+51987654323',
        correo: 'carlos.rodriguez@email.com',
      },
      {
        nombre_completo: 'Ana Mendoza Silva',
        telefono: '+51987654324',
        correo: 'ana.mendoza@email.com',
      },
      {
        nombre_completo: 'Luis Torres Díaz',
        telefono: '+51987654325',
        correo: 'luis.torres@email.com',
      }
    ],
    skipDuplicates: true,
  });

  // 3. Insertar mesas
  console.log('🪑 Insertando mesas...');
  const mesas = await prisma.mesa.createMany({
    data: [
      { nombre_mesa: 'Mesa 1', capacidad: 4, estado: 'libre' },
      { nombre_mesa: 'Mesa 2', capacidad: 4, estado: 'libre' },
      { nombre_mesa: 'Mesa 3', capacidad: 6, estado: 'ocupada' },
      { nombre_mesa: 'Mesa 4', capacidad: 4, estado: 'libre' },
      { nombre_mesa: 'Mesa 5', capacidad: 2, estado: 'reservada' },
      { nombre_mesa: 'Mesa 6', capacidad: 8, estado: 'libre' },
      { nombre_mesa: 'VIP 1', capacidad: 6, estado: 'libre' },
      { nombre_mesa: 'VIP 2', capacidad: 8, estado: 'ocupada' },
      { nombre_mesa: 'Terraza 1', capacidad: 4, estado: 'libre' },
      { nombre_mesa: 'Terraza 2', capacidad: 4, estado: 'mantenimiento' }
    ],
    skipDuplicates: true,
  });

  // 4. Insertar menú (platos)
  console.log('🍜 Insertando menú...');
  const menus = await prisma.menu.createMany({
    data: [
      {
        nombre_plato: 'Aeropuerto Especial',
        descripcion: 'Arroz chaufa con pollo, chancho, camarones, tortilla y verduras',
        precio: 28.00,
        categoria: 'Plato de Fondo',
        tiempo_preparacion: 20,
        disponible: true,
        oferta: false,
        imagen_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80'
      },
      {
        nombre_plato: 'Tallarín Saltado Especial',
        descripcion: 'Tallarín salteado con carne, verduras y salsa especial',
        precio: 22.00,
        categoria: 'Plato de Fondo',
        tiempo_preparacion: 15,
        disponible: true,
        oferta: true,
        descuento: 10.00,
        imagen_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80'
      },
      {
        nombre_plato: 'Arroz Chaufa de Pollo',
        descripcion: 'Arroz frito con pollo, huevo, cebollín y salsa de soja',
        precio: 18.00,
        categoria: 'Plato de Fondo',
        tiempo_preparacion: 12,
        disponible: true,
        oferta: false,
        imagen_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80'
      },
      {
        nombre_plato: 'Wantán Frito (8 unidades)',
        descripcion: 'Wantanes rellenos fritos con salsa agridulce',
        precio: 14.00,
        categoria: 'Entrada',
        tiempo_preparacion: 10,
        disponible: true,
        oferta: false,
        imagen_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80'
      },
      {
        nombre_plato: 'Pollo con Almendras',
        descripcion: 'Pollo salteado con almendras crocantes y verduras mixtas',
        precio: 24.00,
        categoria: 'Plato de Fondo',
        tiempo_preparacion: 18,
        disponible: true,
        oferta: true,
        descuento: 15.00,
        imagen_url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80'
      },
      {
        nombre_plato: 'Cerdo Agridulce',
        descripcion: 'Cerdo en salsa agridulce con piña, pimientos y cebolla',
        precio: 23.00,
        categoria: 'Plato de Fondo',
        tiempo_preparacion: 16,
        disponible: true,
        oferta: false,
        imagen_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80'
      },
      {
        nombre_plato: 'Lomo Saltado',
        descripcion: 'Lomo de res salteado con cebolla, tomate y papas fritas',
        precio: 26.00,
        categoria: 'Plato de Fondo',
        tiempo_preparacion: 17,
        disponible: true,
        oferta: false,
        imagen_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80'
      },
      {
        nombre_plato: 'Sopa Wantán',
        descripcion: 'Sopa con wantanes rellenos, verduras y pollo',
        precio: 12.00,
        categoria: 'Sopa',
        tiempo_preparacion: 8,
        disponible: true,
        oferta: false,
        imagen_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80'
      },
      {
        nombre_plato: 'Pollo Tipakay',
        descripcion: 'Pollo en salsa de ostión con verduras y cebollín',
        precio: 22.00,
        categoria: 'Plato de Fondo',
        tiempo_preparacion: 14,
        disponible: true,
        oferta: false,
        imagen_url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80'
      },
      {
        nombre_plato: 'Chaufa de Mariscos',
        descripcion: 'Arroz chaufa con mixto de mariscos y verduras',
        precio: 30.00,
        categoria: 'Plato de Fondo',
        tiempo_preparacion: 22,
        disponible: true,
        oferta: false,
        imagen_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80'
      },
      {
        nombre_plato: 'Arroz con Pato',
        descripcion: 'Tradicional arroz con pato estilo norteño',
        precio: 25.00,
        categoria: 'Plato de Fondo',
        tiempo_preparacion: 25,
        disponible: false, // Agotado
        oferta: false,
        imagen_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80'
      }
    ],
    skipDuplicates: true,
  });

  // 5. Insertar bebidas
  console.log('🥤 Insertando bebidas...');
  const bebidas = await prisma.bebida.createMany({
    data: [
      {
        nombre_bebida: 'Inca Kola 500ml',
        descripcion: 'Refresco peruano sabor golden kola bien fría',
        precio: 6.00,
        categoria: 'Gaseosa',
        tamano: '500ml',
        disponible: true,
        imagen_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80'
      },
      {
        nombre_bebida: 'Coca Cola 500ml',
        descripcion: 'Refresco de cola',
        precio: 5.50,
        categoria: 'Gaseosa',
        tamano: '500ml',
        disponible: true,
        imagen_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80'
      },
      {
        nombre_bebida: 'Chicha Morada 1L',
        descripcion: 'Bebida tradicional peruana de maíz morado',
        precio: 8.00,
        categoria: 'Jugo',
        tamano: '1L',
        disponible: true,
        imagen_url: 'https://images.unsplash.com/photo-1571575173700-afb9492e6a50?w=400&q=80'
      },
      {
        nombre_bebida: 'Maracuyá Juice',
        descripcion: 'Jugo natural de maracuyá',
        precio: 9.00,
        categoria: 'Jugo',
        tamano: '500ml',
        disponible: true,
        imagen_url: 'https://images.unsplash.com/photo-1571575173700-afb9492e6a50?w=400&q=80'
      },
      {
        nombre_bebida: 'Té Chino Jasmine',
        descripcion: 'Té tradicional chino jasmine aroma delicado',
        precio: 5.00,
        categoria: 'Infusión',
        tamano: 'Taza',
        disponible: true,
        imagen_url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80'
      },
      {
        nombre_bebida: 'Cerveza Cusqueña 330ml',
        descripcion: 'Cerveza lager peruana',
        precio: 12.00,
        categoria: 'Cerveza',
        tamano: '330ml',
        disponible: true,
        imagen_url: 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=400&q=80'
      },
      {
        nombre_bebida: 'Agua Mineral 500ml',
        descripcion: 'Agua mineral sin gas',
        precio: 3.00,
        categoria: 'Agua',
        tamano: '500ml',
        disponible: true,
        imagen_url: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80'
      },
      {
        nombre_bebida: 'Pisco Sour',
        descripcion: 'Coctel tradicional peruano',
        precio: 18.00,
        categoria: 'Coctel',
        tamano: 'Copa',
        disponible: true,
        imagen_url: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&q=80'
      }
    ],
    skipDuplicates: true,
  });

  // 6. Insertar favoritos
  console.log('❤️ Insertando favoritos...');
  const favoritos = await prisma.favorito.createMany({
    data: [
      { id_menu: 1, numero_favoritos: 25 },
      { id_menu: 2, numero_favoritos: 18 },
      { id_menu: 3, numero_favoritos: 32 },
      { id_menu: 5, numero_favoritos: 15 },
      { id_bebida: 1, numero_favoritos: 40 },
      { id_bebida: 6, numero_favoritos: 22 },
      { id_bebida: 3, numero_favoritos: 28 }
    ],
    skipDuplicates: true,
  });

  // 7. Insertar pedidos con números únicos
  console.log('📦 Insertando pedidos...');
  const pedidos = await prisma.pedido.createMany({
    data: [
      {
        numero_pedido: 'PED-001',
        id_cliente: 1,
        id_mesa: 1,
        id_mesero: 3, // María López - Mesera
        nombre_cliente: 'Juan Pérez García',
        estado: 'entregado',
        total: 68.00,
        observaciones: 'Sin ají por favor',
        fecha_pedido: new Date('2024-01-15 12:30:00'),
        fecha_entrega: new Date('2024-01-15 13:15:00')
      },
      {
        numero_pedido: 'PED-002',
        id_cliente: 2,
        id_mesa: 3,
        id_mesero: 3,
        nombre_cliente: 'María López Soto',
        estado: 'en_preparacion',
        total: 27.50,
        observaciones: 'Bien cocido',
        fecha_pedido: new Date('2024-01-15 13:15:00')
      },
      {
        numero_pedido: 'PED-003',
        id_cliente: 3,
        id_mesa: 2,
        id_mesero: 3,
        nombre_cliente: 'Carlos Rodríguez',
        estado: 'pendiente',
        total: 69.00,
        fecha_pedido: new Date('2024-01-15 14:00:00')
      },
      {
        numero_pedido: 'PED-004',
        id_mesa: 4,
        id_mesero: 3,
        nombre_cliente: 'Cliente Ocasional', // Cliente sin registro
        estado: 'preparado',
        total: 14.00,
        fecha_pedido: new Date('2024-01-15 14:30:00')
      },
      {
        numero_pedido: 'PED-005',
        id_cliente: 5,
        id_mesa: 6,
        id_mesero: 3,
        nombre_cliente: 'Luis Torres Díaz',
        estado: 'entregado',
        total: 58.00,
        fecha_pedido: new Date('2024-01-14 19:45:00'),
        fecha_entrega: new Date('2024-01-14 20:30:00')
      }
    ],
    skipDuplicates: true,
  });

  // 8. Insertar items de pedido
  console.log('🍽️ Insertando items de pedido...');
  const itemsPedido = await prisma.itemPedido.createMany({
    data: [
      // Pedido 1
      { id_pedido: 1, id_menu: 1, cantidad: 2, precio_unitario: 28.00, subtotal: 56.00 },
      { id_pedido: 1, id_bebida: 1, cantidad: 2, precio_unitario: 6.00, subtotal: 12.00 },
      
      // Pedido 2
      { id_pedido: 2, id_menu: 2, cantidad: 1, precio_unitario: 22.00, subtotal: 22.00 },
      { id_pedido: 2, id_bebida: 2, cantidad: 1, precio_unitario: 5.50, subtotal: 5.50 },
      
      // Pedido 3
      { id_pedido: 3, id_menu: 3, cantidad: 3, precio_unitario: 18.00, subtotal: 54.00 },
      { id_pedido: 3, id_bebida: 3, cantidad: 1, precio_unitario: 8.00, subtotal: 8.00 },
      { id_pedido: 3, id_bebida: 6, cantidad: 1, precio_unitario: 12.00, subtotal: 12.00 },
      
      // Pedido 4
      { id_pedido: 4, id_menu: 4, cantidad: 1, precio_unitario: 14.00, subtotal: 14.00 },
      
      // Pedido 5
      { id_pedido: 5, id_menu: 5, cantidad: 2, precio_unitario: 24.00, subtotal: 48.00 },
      { id_pedido: 5, id_bebida: 5, cantidad: 2, precio_unitario: 5.00, subtotal: 10.00 }
    ],
    skipDuplicates: true,
  });

  // 9. Insertar pagos
  console.log('💳 Insertando pagos...');
  const pagos = await prisma.pago.createMany({
    data: [
      {
        id_pedido: 1,
        id_cajero: 2, // Carlos Mendoza - Cajero
        metodo_pago: 'efectivo',
        monto: 68.00,
        monto_recibido: 70.00,
        cambio: 2.00,
        comprobante: 'B001-0001',
        pagado: true,
        fecha_pago: new Date('2024-01-15 13:00:00')
      },
      {
        id_pedido: 2,
        id_cajero: 2,
        metodo_pago: 'yape',
        monto: 27.50,
        comprobante: 'YAPE-001',
        pagado: true,
        fecha_pago: new Date('2024-01-15 13:20:00')
      },
      {
        id_pedido: 5,
        id_cajero: 2,
        metodo_pago: 'tarjeta',
        monto: 58.00,
        comprobante: 'TARJ-001',
        pagado: true,
        fecha_pago: new Date('2024-01-14 20:00:00')
      }
    ],
    skipDuplicates: true,
  });

  // 10. Insertar reportes
  console.log('📊 Insertando reportes...');
  const reportes = await prisma.reporte.createMany({
    data: [
      {
        tipo_reporte: 'mensual',
        fecha_inicio: new Date('2024-01-01'),
        fecha_fin: new Date('2024-01-31'),
        total_ventas: 12540.50,
        total_pedidos: 156,
        plato_mas_vendido: 'Aeropuerto Especial',
        bebida_mas_vendida: 'Inca Kola 500ml',
        metodo_pago_preferido: 'efectivo',
        promedio_ticket: 80.39,
        datos_json: JSON.stringify({
          ventas_por_dia: { '2024-01-15': 850, '2024-01-16': 720 },
          categorias_mas_vendidas: ['Plato de Fondo', 'Bebidas', 'Entradas'],
          horario_pico: '13:00-14:00'
        })
      },
      {
        tipo_reporte: 'mensual',
        fecha_inicio: new Date('2023-12-01'),
        fecha_fin: new Date('2023-12-31'),
        total_ventas: 11875.25,
        total_pedidos: 142,
        plato_mas_vendido: 'Tallarín Saltado Especial',
        bebida_mas_vendida: 'Cerveza Cusqueña',
        metodo_pago_preferido: 'yape',
        promedio_ticket: 83.63,
        datos_json: JSON.stringify({
          ventas_por_dia: { '2023-12-24': 1200, '2023-12-31': 1500 },
          categorias_mas_vendidas: ['Plato de Fondo', 'Bebidas', 'Sopas'],
          horario_pico: '20:00-21:00'
        })
      }
    ],
    skipDuplicates: true,
  });

  console.log('✅ Todos los datos insertados correctamente!');
  console.log('📊 Resumen:');
  console.log(`   - ${(await prisma.rol.count())} roles creados`);
  console.log(`   - ${(await prisma.cliente.count())} clientes creados`);
  console.log(`   - ${(await prisma.mesa.count())} mesas creadas`);
  console.log(`   - ${(await prisma.menu.count())} platos en menú`);
  console.log(`   - ${(await prisma.bebida.count())} bebidas creadas`);
  console.log(`   - ${(await prisma.pedido.count())} pedidos creados`);
  console.log(`   - ${(await prisma.pago.count())} pagos registrados`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante la inserción:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });