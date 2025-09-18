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
