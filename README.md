# Guia-4
 Solución Guía 4 - Desarrollo de Software - Universidad EAN

## 📦 TechLogistics - Sistema de Gestión Logística

### 📋 Descripción

Sistema integral de gestión logística para la empresa TechLogistics S.A., que permite administrar clientes, productos, pedidos, transportistas y rutas de envío mediante una arquitectura de tres capas. Esta solución moderniza la infraestructura tecnológica, facilitando la gestión de pedidos y el rastreo de envíos en tiempo real.

---

**Requerimientos principales del proyecto:**

- **Diseño y modelado de la base de datos:**
  - Modelo Entidad-Relación (MER)
  - Esquema relacional normalizado
  - Entidades: Clientes, Pedidos, Productos, Transportistas, Rutas, Estados de Envío

- **Implementación de la base de datos:**
  - Gestor: MySQL
  - Creación de tablas con claves primarias y foráneas

- **Comunicación y sincronización de datos:**
  - API REST con Node.js y Express
  - Conexión entre base de datos y aplicación cliente

- **Interfaces de usuario:**
  - Interfaz web para gestión y seguimiento de pedidos
  - Tecnologías: HTML, CSS, JavaScript y Vue.js

---


### 📁 Estructura del Proyecto

```
TechLogistics/
├── APIREST/
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
├── PAGINA/
│   ├── index.html
│   └── style.css
└── SQL Crear Base de Datos/
    └── SQL Crear Base de Datos.sql
```

---

### 🛠️ Instalación y Configuración

#### Requisitos

- Node.js (v14+)
- MySQL (v5.7+)
- npm o yarn

#### 1. Base de Datos

1. Iniciar el servidor MySQL
2. Ejecutar:
```bash
mysql -u root -p < "SQL Crear Base de Datos/SQL Crear Base de Datos.sql"
```

#### 2. Backend (API REST)

1. Ir a la carpeta de la API:
```bash
cd APIREST
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar conexión en `index.js`:
```javascript
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234', // Cambiar según configuración
  database: 'TechLogistics',
  port: 3306
});
```

---

### ▶️ Ejecución del Sistema

#### Para ejecutar la API:

```bash
cd APIREST
node index.js
```
Acceder a: `http://localhost:3000/api`

#### Para iniciar la aplicación web:

```bash
cd PAGINA
npx serve .
```

---

### 💻 Uso del Sistema

#### Interfaz de Usuario

La aplicación tiene 3 secciones:

1. **Clientes**
   - Ver, crear, editar, eliminar
   - Campos: nombre, email, teléfono, dirección

2. **Productos**
   - Ver, crear, editar, eliminar
   - Campos: nombre, descripción, precio, stock

3. **Pedidos**
   - Crear pedidos seleccionando cliente y productos
   - Ver detalles, consultar estado actual

Tecnologías utilizadas:

- Vue.js → interfaz reactiva
- Axios → conexión con la API

---

### 🔍 Funcionamiento del Sistema

La base de datos MySQL está compuesta por 7 tablas interrelacionadas. La tabla `Pedidos` es el eje del sistema y enlaza con cliente, productos, ruta, estado y transportista.

La API REST, construida con Node.js y Express, usa:

- `express` → para rutas
- `mysql2` → para conexión
- `cors` → para habilitar origen cruzado

Cada acción en la interfaz web impacta directamente en la base de datos.

