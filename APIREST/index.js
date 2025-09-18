/********************************************
 * index.js
 * API REST para TechLogistics
 ********************************************/

// Importaciones y configuración inicial
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;

// Para poder leer JSON en body de las peticiones:
app.use(express.json());
app.use(cors());

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'TechLogistics',
  port: 3306
});

db.connect((error) => {
  if (error) {
    console.error('Error conectando a la base de datos:', error);
    process.exit(1);
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

// =========================================================
// ================ RUTAS PRINCIPALES ======================
// =========================================================

/**
 *  A continuación se incluyen los endpoints para las entidades
 *  principales del sistema: Clientes, Productos, Pedidos, etc.
 */

// =========================================================
// CLIENTES
// =========================================================

// GET: Obtener todos los clientes
app.get('/api/clientes', (req, res) => {
  db.query('SELECT * FROM Clientes', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// GET: Obtener cliente por ID
app.get('/api/clientes/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM Clientes WHERE id_cliente = ?', [id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.json(results[0]);
  });
});

// POST: Crear nuevo cliente
app.post('/api/clientes', (req, res) => {
  const { nombre, email, telefono, direccion } = req.body;
  if (!nombre || !email) {
    return res.status(400).json({ message: 'Datos insuficientes para crear cliente' });
  }

  const sql = 'INSERT INTO Clientes (nombre, email, telefono, direccion) VALUES (?, ?, ?, ?)';
  db.query(sql, [nombre, email, telefono || null, direccion || null], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({
      message: 'Cliente creado exitosamente',
      id: result.insertId
    });
  });
});

// PUT: Actualizar un cliente
app.put('/api/clientes/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, email, telefono, direccion } = req.body;

  const sql = 'UPDATE Clientes SET nombre = ?, email = ?, telefono = ?, direccion = ? WHERE id_cliente = ?';
  db.query(
    sql,
    [nombre, email, telefono, direccion, id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Cliente no encontrado o sin cambios' });
      }
      res.json({ message: 'Cliente actualizado correctamente' });
    }
  );
});

// DELETE: Eliminar un cliente
app.delete('/api/clientes/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM Clientes WHERE id_cliente = ?', [id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json({ message: 'Cliente eliminado correctamente' });
  });
});

// =========================================================
// PRODUCTOS
// =========================================================

// GET: Obtener todos los productos
app.get('/api/productos', (req, res) => {
  db.query('SELECT * FROM Productos', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// GET: Obtener producto por ID
app.get('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM Productos WHERE id_producto = ?', [id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(results[0]);
  });
});

// POST: Crear nuevo producto
app.post('/api/productos', (req, res) => {
  const { nombre, descripcion, precio, stock } = req.body;
  if (!nombre || !precio) {
    return res.status(400).json({ message: 'Datos insuficientes para crear producto' });
  }
  const sql = 'INSERT INTO Productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)';
  db.query(sql, [nombre, descripcion || '', precio, stock || 0], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({
      message: 'Producto creado exitosamente',
      id: result.insertId
    });
  });
});

// PUT: Actualizar un producto
app.put('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock } = req.body;
  const sql = `
    UPDATE Productos
    SET nombre = ?, descripcion = ?, precio = ?, stock = ?
    WHERE id_producto = ?
  `;
  db.query(sql, [nombre, descripcion, precio, stock, id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado o sin cambios' });
    }
    res.json({ message: 'Producto actualizado correctamente' });
  });
});

// DELETE: Eliminar un producto
app.delete('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM Productos WHERE id_producto = ?', [id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado correctamente' });
  });
});

// =========================================================
// PEDIDOS
// =========================================================

// GET: Obtener todos los pedidos (básico)
app.get('/api/pedidos', (req, res) => {
  // Traemos información general de los pedidos
  const sql = `
    SELECT p.*, c.nombre AS nombre_cliente, e.nombre_estado
    FROM Pedidos p
    JOIN Clientes c ON p.id_cliente = c.id_cliente
    JOIN Estados_Envio e ON p.id_estado = e.id_estado
    ORDER BY p.id_pedido DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// GET: Obtener un pedido con sus detalles
app.get('/api/pedidos/:id', (req, res) => {
  const { id } = req.params;
  // 1) Traer datos del pedido
  const sqlPedido = `
    SELECT p.*, c.nombre AS nombre_cliente, e.nombre_estado, t.nombre AS nombre_transportista, r.origen, r.destino
    FROM Pedidos p
    JOIN Clientes c ON p.id_cliente = c.id_cliente
    JOIN Estados_Envio e ON p.id_estado = e.id_estado
    LEFT JOIN Transportistas t ON p.id_transportista = t.id_transportista
    LEFT JOIN Rutas r ON p.id_ruta = r.id_ruta
    WHERE p.id_pedido = ?
  `;
  db.query(sqlPedido, [id], (err, pedidoResult) => {
    if (err) return res.status(500).send(err);
    if (pedidoResult.length === 0) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    // 2) Traer el detalle del pedido
    const sqlDetalle = `
      SELECT dp.*, prod.nombre AS nombre_producto
      FROM Detalles_Pedido dp
      JOIN Productos prod ON dp.id_producto = prod.id_producto
      WHERE dp.id_pedido = ?
    `;
    db.query(sqlDetalle, [id], (err, detalleResult) => {
      if (err) return res.status(500).send(err);
      // 3) Respuesta final
      const pedidoInfo = pedidoResult[0];
      pedidoInfo.detalles = detalleResult;
      res.json(pedidoInfo);
    });
  });
});

/**
 * POST: Crear un nuevo pedido con detalles de productos.
 * 1. Se inserta el encabezado del pedido (tabla Pedidos).
 * 2. Se obtienen los productos (del body) para registrar los detalles.
 * 3. Se calcula el total y se actualiza el stock de los productos (opcional).
 */
app.post('/api/pedidos', (req, res) => {
  const { id_cliente, direccion_envio, productos } = req.body;

  if (!id_cliente || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({
      message: 'Faltan datos para crear el pedido (id_cliente o productos)'
    });
  }

  // Estado por defecto "Pendiente" (suponiendo que ID 1 en Estados_Envio es Pendiente)
  const estadoInicial = 1;

  // 1) Crear el pedido en la tabla Pedidos
  const sqlInsertPedido = `
    INSERT INTO Pedidos (id_cliente, direccion_envio, id_estado, total)
    VALUES (?, ?, ?, 0)
  `;
  db.query(sqlInsertPedido, [id_cliente, direccion_envio || '', estadoInicial], (err, result) => {
    if (err) return res.status(500).send(err);

    const newOrderId = result.insertId;
    let totalPedido = 0;

    // 2) Procesar los productos uno por uno
    const procesarProducto = (index) => {
      if (index >= productos.length) {
        // Todos los productos procesados
        // 3) Actualizar el total del pedido
        const sqlUpdateTotal = 'UPDATE Pedidos SET total = ? WHERE id_pedido = ?';
        db.query(sqlUpdateTotal, [totalPedido, newOrderId], (err2) => {
          if (err2) return res.status(500).send(err2);
          return res.json({
            message: 'Pedido creado exitosamente',
            id_pedido: newOrderId
          });
        });
        return;
      }

      const { id_producto, cantidad } = productos[index];
      // Obtener precio del producto para calcular subtotal y actualizar stock
      const sqlGetProducto = 'SELECT precio, stock FROM Productos WHERE id_producto = ?';
      db.query(sqlGetProducto, [id_producto], (err3, prodResult) => {
        if (err3) return res.status(500).send(err3);
        if (prodResult.length === 0) {
          // Producto no existe
          // Saltamos a siguiente
          procesarProducto(index + 1);
          return;
        }

        const { precio, stock } = prodResult[0];
        const subtotal = precio * cantidad;
        totalPedido += subtotal;

        // Insertar detalle
        const sqlInsertDetalle = `
          INSERT INTO Detalles_Pedido (id_pedido, id_producto, cantidad, precio_unitario)
          VALUES (?, ?, ?, ?)
        `;
        db.query(sqlInsertDetalle, [newOrderId, id_producto, cantidad, precio], (err4) => {
          if (err4) return res.status(500).send(err4);

          // Actualizar stock del producto
          const newStock = stock - cantidad;
          if (newStock < 0) {
            console.log(`Advertencia: no hay suficiente stock para el producto ${id_producto}.`);
          }
          const sqlUpdateStock = 'UPDATE Productos SET stock = ? WHERE id_producto = ?';
          db.query(sqlUpdateStock, [newStock, id_producto], (err5) => {
            if (err5) return res.status(500).send(err5);
            // Pasar al siguiente producto
            procesarProducto(index + 1);
          });
        });
      });
    };

    // Iniciar procesamiento recursivo/secuencial
    procesarProducto(0);
  });
});

// PUT: Actualizar un pedido (p.e. cambiar estado, dirección o transportista)
app.put('/api/pedidos/:id', (req, res) => {
  const { id } = req.params;
  const { id_estado, direccion_envio, id_transportista, id_ruta } = req.body;

  // Solo actualizamos las columnas que vengan
  const sql = `
    UPDATE Pedidos
    SET
      id_estado = COALESCE(?, id_estado),
      direccion_envio = COALESCE(?, direccion_envio),
      id_transportista = COALESCE(?, id_transportista),
      id_ruta = COALESCE(?, id_ruta)
    WHERE id_pedido = ?
  `;
  db.query(sql, [id_estado, direccion_envio, id_transportista, id_ruta, id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pedido no encontrado o sin cambios' });
    }
    res.json({ message: 'Pedido actualizado correctamente' });
  });
});

// DELETE: Eliminar un pedido
app.delete('/api/pedidos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM Pedidos WHERE id_pedido = ?', [id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    // Gracias a ON DELETE CASCADE, se eliminan también los detalles
    res.json({ message: 'Pedido eliminado correctamente' });
  });
});

// =========================================================
// TRANSPORTISTAS
// =========================================================
app.get('/api/transportistas', (req, res) => {
  db.query('SELECT * FROM Transportistas', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// =========================================================
// RUTAS
// =========================================================
app.get('/api/rutas', (req, res) => {
  db.query('SELECT * FROM Rutas', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// =========================================================
// ESTADOS DE ENVIO
// =========================================================
app.get('/api/estados-envio', (req, res) => {
  db.query('SELECT * FROM Estados_Envio', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// =========================================================
// Servidor en marcha
// =========================================================
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});
