-- CreateTable
CREATE TABLE `bebida` (
    `id_bebida` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_bebida` VARCHAR(100) NOT NULL,
    `descripcion` TEXT NULL,
    `precio` DECIMAL(10, 2) NOT NULL,
    `creado_en` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_precio`(`precio`),
    PRIMARY KEY (`id_bebida`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `carrito` (
    `id_carrito` INTEGER NOT NULL AUTO_INCREMENT,
    `id_cliente` INTEGER NOT NULL,
    `creado_en` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_cliente`(`id_cliente`),
    PRIMARY KEY (`id_carrito`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cliente` (
    `id_cliente` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_completo` VARCHAR(100) NOT NULL,
    `telefono` VARCHAR(15) NULL,
    `correo` VARCHAR(100) NULL,
    `fecha_registro` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `idx_correo`(`correo`),
    INDEX `idx_telefono`(`telefono`),
    PRIMARY KEY (`id_cliente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `favorito` (
    `id_favorito` INTEGER NOT NULL AUTO_INCREMENT,
    `id_menu` INTEGER NOT NULL,
    `id_bebida` INTEGER NULL,
    `numero_favoritos` INTEGER NULL DEFAULT 0,

    INDEX `id_bebida`(`id_bebida`),
    INDEX `id_menu`(`id_menu`),
    INDEX `idx_favoritos`(`numero_favoritos`),
    PRIMARY KEY (`id_favorito`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menu` (
    `id_menu` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_plato` VARCHAR(100) NOT NULL,
    `descripcion` TEXT NULL,
    `precio` DECIMAL(10, 2) NOT NULL,
    `tiempo_preparacion` INTEGER NULL,
    `oferta` BOOLEAN NULL DEFAULT false,
    `creado_en` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `imagen_url` VARCHAR(191) NULL,

    INDEX `idx_oferta`(`oferta`),
    INDEX `idx_precio`(`precio`),
    PRIMARY KEY (`id_menu`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mesa` (
    `id_mesa` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_mesa` VARCHAR(20) NOT NULL,
    `estado` ENUM('libre', 'ocupada', 'reservada') NULL DEFAULT 'libre',

    INDEX `idx_estado`(`estado`),
    PRIMARY KEY (`id_mesa`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pago` (
    `id_pago` INTEGER NOT NULL AUTO_INCREMENT,
    `id_pedido` INTEGER NOT NULL,
    `id_cajero` INTEGER NULL,
    `metodo_pago` ENUM('efectivo', 'yape', 'plin', 'tarjeta') NOT NULL,
    `monto` DECIMAL(10, 2) NOT NULL,
    `fecha_pago` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id_cajero`(`id_cajero`),
    INDEX `id_pedido`(`id_pedido`),
    INDEX `idx_fecha`(`fecha_pago`),
    INDEX `idx_metodo`(`metodo_pago`),
    PRIMARY KEY (`id_pago`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pedido` (
    `id_pedido` INTEGER NOT NULL AUTO_INCREMENT,
    `id_menu` INTEGER NULL,
    `id_bebida` INTEGER NULL,
    `id_cliente` INTEGER NULL,
    `id_mesa` INTEGER NULL,
    `cantidad` INTEGER NULL DEFAULT 1,
    `estado` ENUM('pendiente', 'en_preparacion', 'preparado', 'entregado', 'cancelado') NULL DEFAULT 'pendiente',
    `fecha_pedido` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `id_bebida`(`id_bebida`),
    INDEX `id_menu`(`id_menu`),
    INDEX `id_mesa`(`id_mesa`),
    INDEX `idx_cliente`(`id_cliente`),
    INDEX `idx_estado`(`estado`),
    INDEX `idx_fecha`(`fecha_pedido`),
    PRIMARY KEY (`id_pedido`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reporte` (
    `id_reporte` INTEGER NOT NULL AUTO_INCREMENT,
    `total_ventas_mes` DECIMAL(10, 2) NULL,
    `bebidas_mas_vendidas` TEXT NULL,
    `pedidos_por_empleado` TEXT NULL,
    `plato_mas_vendido` TEXT NULL,
    `fecha_generado` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `id_pedido` INTEGER NULL,

    INDEX `id_pedido`(`id_pedido`),
    INDEX `idx_fecha`(`fecha_generado`),
    PRIMARY KEY (`id_reporte`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rol` (
    `id_rol` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_rol` VARCHAR(50) NOT NULL,
    `correo` VARCHAR(100) NOT NULL,
    `clave` VARCHAR(255) NOT NULL,
    `creado_en` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `correo`(`correo`),
    INDEX `idx_nombre_rol`(`nombre_rol`),
    PRIMARY KEY (`id_rol`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `carrito` ADD CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `cliente`(`id_cliente`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorito` ADD CONSTRAINT `favorito_ibfk_1` FOREIGN KEY (`id_menu`) REFERENCES `menu`(`id_menu`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorito` ADD CONSTRAINT `favorito_ibfk_2` FOREIGN KEY (`id_bebida`) REFERENCES `bebida`(`id_bebida`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pago` ADD CONSTRAINT `pago_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedido`(`id_pedido`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pago` ADD CONSTRAINT `pago_ibfk_2` FOREIGN KEY (`id_cajero`) REFERENCES `rol`(`id_rol`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedido` ADD CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`id_menu`) REFERENCES `menu`(`id_menu`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedido` ADD CONSTRAINT `pedido_ibfk_2` FOREIGN KEY (`id_bebida`) REFERENCES `bebida`(`id_bebida`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedido` ADD CONSTRAINT `pedido_ibfk_3` FOREIGN KEY (`id_cliente`) REFERENCES `cliente`(`id_cliente`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedido` ADD CONSTRAINT `pedido_ibfk_4` FOREIGN KEY (`id_mesa`) REFERENCES `mesa`(`id_mesa`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reporte` ADD CONSTRAINT `reporte_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedido`(`id_pedido`) ON DELETE SET NULL ON UPDATE CASCADE;
