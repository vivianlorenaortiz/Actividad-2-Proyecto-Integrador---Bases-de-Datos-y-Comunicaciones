-- 1) Crear base de datos y usarla
CREATE DATABASE IF NOT EXISTS TechLogistics;
USE TechLogistics;

-- 2) Tabla: Clientes
--    Guarda la información de los clientes que realizan pedidos.
CREATE TABLE IF NOT EXISTS Clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(200),
    fecha_registro DATE DEFAULT (CURRENT_DATE)
);

-- 3) Tabla: Productos
--    Lista los productos que se pueden vender / gestionar en los pedidos.
CREATE TABLE IF NOT EXISTS Productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255),
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0
);

-- 4) Tabla: Estados_Envio
--    Contiene los posibles estados por los que pasa un pedido (ej. Pendiente, En tránsito, Entregado, etc.).
CREATE TABLE IF NOT EXISTS Estados_Envio (
    id_estado INT AUTO_INCREMENT PRIMARY KEY,
    nombre_estado VARCHAR(50) NOT NULL
);

-- 5) Tabla: Transportistas
--    Información sobre los transportistas (conductores o empresas) que manejan los envíos.
CREATE TABLE IF NOT EXISTS Transportistas (
    id_transportista INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    detalle_vehiculo VARCHAR(100)
);

-- 6) Tabla: Rutas
--    Define rutas disponibles para la logística (origen-destino).
CREATE TABLE IF NOT EXISTS Rutas (
    id_ruta INT AUTO_INCREMENT PRIMARY KEY,
    origen VARCHAR(100) NOT NULL,
    destino VARCHAR(100) NOT NULL,
    distancia_km DECIMAL(10, 2) DEFAULT 0.00
);

-- 7) Tabla: Pedidos
--    Contiene la información básica de cada pedido, vinculada a clientes y estados.
CREATE TABLE IF NOT EXISTS Pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    fecha_pedido DATE NOT NULL DEFAULT (CURRENT_DATE),
    direccion_envio VARCHAR(200),
    total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    id_estado INT NOT NULL,
    id_transportista INT,
    id_ruta INT,
    -- Llaves foráneas
    CONSTRAINT fk_pedido_cliente
        FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_pedido_estado
        FOREIGN KEY (id_estado) REFERENCES Estados_Envio(id_estado)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_pedido_transportista
        FOREIGN KEY (id_transportista) REFERENCES Transportistas(id_transportista)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_pedido_ruta
        FOREIGN KEY (id_ruta) REFERENCES Rutas(id_ruta)
        ON DELETE SET NULL ON UPDATE CASCADE
);

-- 8) Tabla: Detalles_Pedido
--    Representa la relación de N a M entre Pedidos y Productos, con campos
--    para la cantidad y el precio unitario (en caso de que varíe).
CREATE TABLE IF NOT EXISTS Detalles_Pedido (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    precio_unitario DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    -- Llaves foráneas
    CONSTRAINT fk_detalle_pedido
        FOREIGN KEY (id_pedido) REFERENCES Pedidos(id_pedido)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_detalle_producto
        FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO Estados_Envio (nombre_estado) VALUES 
    ('Pendiente'),
    ('En tránsito'),
    ('Entregado');