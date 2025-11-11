// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando inserción de datos...');

  // 1. Insertar roles (empleados/cajeros)
  console.log('👥 Insertando roles...');
  const roles = await prisma.rol.createMany({
    data: [
      {
        nombre_rol: 'Administrador',
        correo: 'admin@chifa.com',
        clave: '$2b$10$ExampleHashForPassword123',
      },
      {
        nombre_rol: 'Cajero',
        correo: 'cajero@chifa.com',
        clave: '$2b$10$ExampleHashForPassword456',
      },
      {
        nombre_rol: 'Chef',
        correo: 'chef@chifa.com',
        clave: '$2b$10$ExampleHashForPassword789',
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
      { nombre_mesa: 'Mesa 1', estado: 'libre' },
      { nombre_mesa: 'Mesa 2', estado: 'libre' },
      { nombre_mesa: 'Mesa 3', estado: 'ocupada' },
      { nombre_mesa: 'Mesa 4', estado: 'libre' },
      { nombre_mesa: 'Mesa 5', estado: 'reservada' },
      { nombre_mesa: 'Mesa 6', estado: 'libre' },
      { nombre_mesa: 'VIP 1', estado: 'libre' },
      { nombre_mesa: 'VIP 2', estado: 'ocupada' }
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
        tiempo_preparacion: 20,
        oferta: false,
        imagen_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80'
      },
      {
        nombre_plato: 'Tallarín Saltado',
        descripcion: 'Tallarín salteado con carne, verduras y salsa especial',
        precio: 22.00,
        tiempo_preparacion: 15,
        oferta: true,
        imagen_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80'
      },
      {
        nombre_plato: 'Arroz Chaufa de Pollo',
        descripcion: 'Arroz frito con pollo, huevo, cebollín y salsa de soja',
        precio: 18.00,
        tiempo_preparacion: 12,
        oferta: false,
        imagen_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80'
      },
      {
        nombre_plato: 'Wantán Frito',
        descripcion: '8 unidades de wantanes rellenos fritos con salsa agridulce',
        precio: 14.00,
        tiempo_preparacion: 10,
        oferta: false,
        imagen_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80'
      },
      {
        nombre_plato: 'Pollo con Almendras',
        descripcion: 'Pollo salteado con almendras crocantes y verduras mixtas',
        precio: 24.00,
        tiempo_preparacion: 18,
        oferta: true,
        imagen_url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80'
      },
      {
        nombre_plato: 'Cerdo Agridulce',
        descripcion: 'Cerdo en salsa agridulce con piña, pimientos y cebolla',
        precio: 23.00,
        tiempo_preparacion: 16,
        oferta: false,
        imagen_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=80'
      },
      {
        nombre_plato: 'Lomo Saltado',
        descripcion: 'Lomo de res salteado con cebolla, tomate y papas fritas',
        precio: 26.00,
        tiempo_preparacion: 17,
        oferta: false,
        imagen_url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80'
      },
      {
        nombre_plato: 'Kam Lu Wantán',
        descripcion: 'Wantán frito con salsa kam lu agridulce espesa',
        precio: 16.00,
        tiempo_preparacion: 8,
        oferta: true,
        imagen_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80'
      },
      {
        nombre_plato: 'Pollo Tipakay',
        descripcion: 'Pollo en salsa de ostión con verduras y cebollín',
        precio: 22.00,
        tiempo_preparacion: 14,
        oferta: false,
        imagen_url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&q=80'
      },
      {
        nombre_plato: 'Chaufa de Mariscos',
        descripcion: 'Arroz chaufa con mixto de mariscos y verduras',
        precio: 30.00,
        tiempo_preparacion: 22,
        oferta: false,
        imagen_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&q=80'
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
        precio: 6.00
      },
      {
        nombre_bebida: 'Coca Cola 500ml',
        descripcion: 'Refresco de cola',
        precio: 5.50
      },
      {
        nombre_bebida: 'Chicha Morada',
        descripcion: 'Bebida tradicional peruana de maíz morado',
        precio: 8.00
      },
      {
        nombre_bebida: 'Maracuyá Juice',
        descripcion: 'Jugo natural de maracuyá',
        precio: 9.00
      },
      {
        nombre_bebida: 'Té Chino Jasmine',
        descripcion: 'Té tradicional chino jasmine aroma delicado',
        precio: 5.00
      },
      {
        nombre_bebida: 'Cerveza Cusqueña',
        descripcion: 'Cerveza lager peruana 330ml',
        precio: 12.00
      },
      {
        nombre_bebida: 'Agua Mineral 500ml',
        descripcion: 'Agua mineral sin gas',
        precio: 3.00
      }
    ],
    skipDuplicates: true,
  });

  // 6. Insertar favoritos
  console.log('❤️ Insertando favoritos...');
  const favoritos = await prisma.favorito.createMany({
    data: [
      { id_menu: 1, id_bebida: 1, numero_favoritos: 15 },
      { id_menu: 2, id_bebida: 2, numero_favoritos: 12 },
      { id_menu: 3, id_bebida: 3, numero_favoritos: 8 },
      { id_menu: 4, id_bebida: 4, numero_favoritos: 10 },
      { id_menu: 5, id_bebida: 5, numero_favoritos: 7 }
    ],
    skipDuplicates: true,
  });

  // 7. Insertar carritos
  console.log('🛒 Insertando carritos...');
  const carritos = await prisma.carrito.createMany({
    data: [
      { id_cliente: 1 },
      { id_cliente: 2 },
      { id_cliente: 3 }
    ],
    skipDuplicates: true,
  });

  // 8. Insertar pedidos
  console.log('📦 Insertando pedidos...');
  const pedidos = await prisma.pedido.createMany({
    data: [
      {
        id_menu: 1,
        id_bebida: 1,
        id_cliente: 1,
        id_mesa: 1,
        cantidad: 2,
        estado: 'entregado',
        fecha_pedido: new Date('2024-01-15 12:30:00')
      },
      {
        id_menu: 2,
        id_bebida: 2,
        id_cliente: 2,
        id_mesa: 3,
        cantidad: 1,
        estado: 'en_preparacion',
        fecha_pedido: new Date('2024-01-15 13:15:00')
      },
      {
        id_menu: 3,
        id_bebida: 3,
        id_cliente: 3,
        id_mesa: 2,
        cantidad: 3,
        estado: 'pendiente',
        fecha_pedido: new Date('2024-01-15 14:00:00')
      },
      {
        id_menu: 4,
        id_bebida: 4,
        id_cliente: 4,
        id_mesa: 4,
        cantidad: 1,
        estado: 'preparado',
        fecha_pedido: new Date('2024-01-15 14:30:00')
      },
      {
        id_menu: 5,
        id_bebida: 5,
        id_cliente: 5,
        id_mesa: 6,
        cantidad: 2,
        estado: 'entregado',
        fecha_pedido: new Date('2024-01-14 19:45:00')
      }
    ],
    skipDuplicates: true,
  });

  // 9. Insertar pagos
  console.log('💳 Insertando pagos...');
  const pagos = await prisma.pago.createMany({
    data: [
      {
        id_pedido: 1,
        id_cajero: 2,
        metodo_pago: 'efectivo',
        monto: 68.00, // 2x28 + 2x6
        fecha_pago: new Date('2024-01-15 13:00:00')
      },
      {
        id_pedido: 2,
        id_cajero: 2,
        metodo_pago: 'yape',
        monto: 27.50, // 22 + 5.5
        fecha_pago: new Date('2024-01-15 13:20:00')
      },
      {
        id_pedido: 5,
        id_cajero: 2,
        metodo_pago: 'tarjeta',
        monto: 58.00, // 2x24 + 2x5
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
        total_ventas_mes: 12540.50,
        bebidas_mas_vendidas: 'Inca Kola: 45, Coca Cola: 32, Chicha Morada: 28',
        pedidos_por_empleado: 'Cajero1: 120, Cajero2: 95',
        plato_mas_vendido: 'Aeropuerto Especial: 65 pedidos',
        id_pedido: 1,
        fecha_generado: new Date('2024-01-01 23:59:59')
      },
      {
        total_ventas_mes: 11875.25,
        bebidas_mas_vendidas: 'Inca Kola: 38, Maracuyá Juice: 25, Cerveza: 22',
        pedidos_por_empleado: 'Cajero1: 110, Cajero2: 85',
        plato_mas_vendido: 'Tallarín Saltado: 58 pedidos',
        id_pedido: 2,
        fecha_generado: new Date('2023-12-01 23:59:59')
      }
    ],
    skipDuplicates: true,
  });

  console.log('✅ Todos los datos insertados correctamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante la inserción:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });