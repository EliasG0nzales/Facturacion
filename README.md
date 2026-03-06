# 🧾 FACTURACIÓN — Sistema de Administración Web

> Sistema de gestión empresarial completo desarrollado en **React + Vite**, que cubre módulos de Autenticación, ABM, Egresos, Ingresos, Reportes y CMS Web.

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 Tabla de Contenidos

- [Requisitos Previos](#-requisitos-previos)
- [Crear el Proyecto desde Cero](#-crear-el-proyecto-desde-cero)
- [Instalación y Ejecución](#-instalación-y-ejecución)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Módulos del Sistema](#-módulos-del-sistema)
- [Autenticación y Login](#-autenticación-y-login)
- [Dashboard](#-dashboard)
- [ABM — Altas Bajas y Modificaciones](#-abm--altas-bajas-y-modificaciones)
- [CMS Web](#-cms--gestión-de-contenido-web)
- [Egresos](#-egresos)
- [Ingresos](#-ingresos)
- [Reportes](#-reportes)
- [Funcionalidades Transversales](#-funcionalidades-transversales)
- [Uso de JavaScript en React](#-uso-de-javascript-en-react)
- [Scripts Disponibles](#-scripts-disponibles)

---

## ✅ Requisitos Previos

Antes de comenzar asegúrate de tener instalado:

| Herramienta | Versión mínima | Descarga |
|---|---|---|
| Node.js | 18.x o superior | https://nodejs.org |
| npm | 9.x o superior | Incluido con Node.js |
| Git | cualquier versión | https://git-scm.com |

Verificar instalación:

```bash
node --version
npm --version
git --version
```

---

## 🚀 Crear el Proyecto desde Cero

### 1. Crear proyecto con Vite

```bash
# Crear nuevo proyecto React con Vite
npm create vite@latest Facturacion -- --template react

# Ingresar a la carpeta del proyecto
cd Facturacion
```

### 2. Instalar dependencias base

```bash
npm install
```

### 3. Instalar dependencias adicionales usadas en el proyecto

```bash
# React Router para navegación entre páginas
npm install react-router-dom

# Axios para llamadas a la API
npm install axios

# SweetAlert2 para alertas y confirmaciones
npm install sweetalert2

# Recharts para gráficos en reportes
npm install recharts

# React Icons para íconos en componentes
npm install react-icons
```

### 4. Crear la estructura de carpetas

```bash
# Desde la raíz del proyecto ejecutar en terminal
mkdir src/pages
mkdir src/pages/Abm
mkdir src/pages/Abm/CMS
mkdir src/pages/Egresos
mkdir src/pages/Ingresos
mkdir src/pages/Ingresos/CRM
mkdir src/pages/Ingresos/Cxc
mkdir src/pages/Ingresos/Venta
mkdir src/pages/Reportes
mkdir src/pages/Reportes/Articulo
mkdir src/pages/Reportes/Caja
mkdir src/pages/Reportes/Compras
mkdir src/pages/Reportes/Contable
mkdir src/pages/Reportes/Venta
mkdir src/components
mkdir src/components/auth
mkdir src/components/facturas
```

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre el navegador en `http://localhost:5173`

### 6. Compilar para producción

```bash
npm run build
```

Los archivos compilados quedan en la carpeta `/dist`

### 7. Previsualizar build de producción

```bash
npm run preview
```

---

## 💻 Instalación y Ejecución

Si ya tienes el proyecto clonado desde GitHub:

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/Facturacion.git

# Entrar a la carpeta
cd Facturacion

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

---

## 🗂️ Estructura del Proyecto

```
FACTURACIÓN/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── FormularioLogin.jsx
│   │   ├── facturas/
│   │   │   └── FormularioConsultaFactura.jsx
│   │   ├── Footer.jsx
│   │   ├── navbar.css
│   │   ├── navbar.jsx
│   │   └── PrivateRoute.jsx
│   └── pages/
│       ├── Abm/
│       │   ├── CMS/
│       │   │   ├── Comentario.jsx
│       │   │   ├── WebBanner.jsx
│       │   │   ├── WebMenu.jsx
│       │   │   ├── WebPagina.jsx
│       │   │   └── WebVisita.jsx
│       │   ├── Articulos.jsx
│       │   ├── Cliente.jsx
│       │   ├── Proveedor.jsx
│       │   ├── Servicios.jsx
│       │   ├── Sucursal.jsx
│       │   ├── SucursalDocumentos.jsx
│       │   ├── TipodeCambio.jsx
│       │   ├── Usuarios.jsx
│       │   └── Utilitario.jsx
│       ├── Egresos/
│       │   ├── Compra.jsx
│       │   ├── CtaPagar.jsx
│       │   ├── CtaPagarLetras.jsx
│       │   ├── Gastos.jsx
│       │   └── OrdenCompra.jsx
│       ├── Ingresos/
│       │   ├── CRM/
│       │   │   ├── Calendario.jsx
│       │   │   ├── Encuesta.jsx
│       │   │   └── Tareas.jsx
│       │   ├── Cxc/
│       │   │   ├── CtaxCobrar.jsx
│       │   │   ├── CxcCobranza.jsx
│       │   │   ├── CxcContable.jsx
│       │   │   ├── CxcLetras.jsx
│       │   │   ├── CxcPendiente.jsx
│       │   │   └── CxcTotal.jsx
│       │   ├── Venta/
│       │   │   ├── ConfirmarPago.jsx
│       │   │   ├── CreditoAcumulado.jsx
│       │   │   ├── NotadeCredito.jsx
│       │   │   ├── NotadeDebito.jsx
│       │   │   ├── OtrosIngresos.jsx
│       │   │   └── Venta.jsx
│       │   ├── AlmacenTraslado.jsx
│       │   ├── Cotizacion.jsx
│       │   ├── GuiaRemision.jsx
│       │   └── PedidoWeb.jsx
│       └── Reportes/
│           ├── Articulo/
│           │   ├── CompraVenta.jsx
│           │   ├── Digemid.jsx
│           │   ├── GeneralXSucursal.jsx
│           │   ├── Lotes.jsx
│           │   ├── StockGeneral.jsx
│           │   └── Valorizado.jsx
│           ├── Caja/
│           │   ├── AperturaCaja.jsx
│           │   ├── MovCaja.jsx
│           │   └── TipoPago.jsx
│           ├── Compras/
│           │   ├── Detallado.jsx
│           │   └── General.jsx
│           ├── Contable/
│           │   ├── Compra.jsx
│           │   └── Venta.jsx
│           ├── Venta/
│           │   ├── Detallado.jsx
│           │   ├── Estadistica.jsx
│           │   ├── General.jsx
│           │   └── Grafico.jsx
│           ├── Asistencia.jsx
│           ├── Dashboard.jsx
│           ├── Kardex.jsx
│           └── MovBancarios.jsx
├── App.css
├── App.jsx
├── main.jsx
├── index.css
├── index.html
├── package.json
└── vite.config.js
```

---

## 📦 Módulos del Sistema

---

## 🔐 Autenticación y Login

### `FormularioLogin.jsx` — `Login.jsx`

El sistema utiliza autenticación mediante usuario y contraseña. El flujo es:

1. El usuario ingresa sus credenciales en `Login.jsx`
2. Se validan contra la API del backend
3. Si son correctas se guarda el token en `localStorage`
4. `PrivateRoute.jsx` protege todas las rutas privadas
5. Si no hay token válido redirige automáticamente al login

**Características del Login:**
- Formulario con usuario y contraseña
- Validación de campos vacíos
- Manejo de errores de autenticación
- Redirección automática al Dashboard tras login exitoso
- Botón de cerrar sesión que limpia el token

**Ejemplo de uso de JavaScript en el Login:**

```jsx
// Login.jsx
import { useState } from "react";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");

  const handleLogin = async () => {
    if (!usuario || !password) {
      setError("Complete todos los campos");
      return;
    }
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard";
      } else {
        setError("Credenciales incorrectas");
      }
    } catch {
      setError("Error de conexión");
    }
  };

  return (
    <div>
      <input value={usuario}  onChange={e => setUsuario(e.target.value)}  placeholder="Usuario"    />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" type="password" />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleLogin}>Ingresar</button>
    </div>
  );
};

export default Login;
```

**PrivateRoute — Protección de rutas:**

```jsx
// PrivateRoute.jsx
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
```

---

## 📊 Dashboard

### `Dashboard.jsx`

Pantalla principal que el usuario ve tras iniciar sesión. Muestra un resumen ejecutivo del negocio con:

- **Tarjetas de resumen** — ventas del día, compras pendientes, clientes nuevos, stock bajo
- **Gráfico de ventas** — evolución mensual usando Recharts
- **Alertas activas** — tareas pendientes y créditos vencidos
- **Accesos rápidos** — botones directos a los módulos más usados

```jsx
// Ejemplo de uso de Recharts en Dashboard
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const datos = [
  { mes: "Ene", ventas: 4200 },
  { mes: "Feb", ventas: 5800 },
  { mes: "Mar", ventas: 3900 },
];

const GraficoVentas = () => (
  <LineChart width={600} height={300} data={datos}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="mes" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="ventas" stroke="#17a2b8" strokeWidth={2} />
  </LineChart>
);
```

---

## 🔷 ABM — Altas, Bajas y Modificaciones

Cada módulo ABM sigue el mismo patrón de desarrollo en React:

### Patrón estándar de un componente ABM

```jsx
import { useState } from "react";

const MiModulo = () => {
  // 1. Estado de datos
  const [registros, setRegistros] = useState([]);
  const [form, setForm]           = useState({ campo1: "", campo2: "" });
  const [modal, setModal]         = useState(null); // null | 'nuevo' | 'editar'
  const [msg, setMsg]             = useState({ tipo: "", texto: "" });

  // 2. Mostrar mensaje temporal
  const showMsg = (tipo, texto) => {
    setMsg({ tipo, texto });
    setTimeout(() => setMsg({ tipo: "", texto: "" }), 2500);
  };

  // 3. Guardar registro
  const guardar = () => {
    if (!form.campo1) return showMsg("danger", "El campo es obligatorio");
    if (modal === "nuevo") {
      setRegistros(prev => [...prev, { ...form, id: Date.now() }]);
      showMsg("success", "Registro agregado correctamente");
    } else {
      setRegistros(prev => prev.map(r => r.id === form.id ? { ...form } : r));
      showMsg("success", "Registro actualizado correctamente");
    }
    setModal(null);
  };

  // 4. Eliminar registro
  const eliminar = (id) => {
    if (window.confirm("¿Eliminar este registro?")) {
      setRegistros(prev => prev.filter(r => r.id !== id));
      showMsg("success", "Registro eliminado");
    }
  };

  return <div>{/* JSX del componente */}</div>;
};

export default MiModulo;
```

### Módulos ABM implementados

| Componente | Descripción | Campos principales |
|---|---|---|
| `Cliente.jsx` | Gestión de clientes | RUC, nombre, dirección, teléfono, email, tipo, crédito |
| `Proveedor.jsx` | Gestión de proveedores | RUC, nombre, contacto, teléfono, tipo |
| `Articulos.jsx` | Catálogo de artículos | Código, nombre, stock, precio venta, precio compra, imagen, insumos |
| `Servicios.jsx` | Servicios ofrecidos | Nombre, descripción, precio, estado |
| `Sucursal.jsx` | Sucursales de la empresa | Nombre, dirección, teléfono, RUC, logo |
| `SucursalDocumentos.jsx` | Documentos por sucursal | Tipo doc, serie, número, sucursal |
| `TipodeCambio.jsx` | Tipo de cambio diario | Fecha, compra, venta |
| `Usuarios.jsx` | Usuarios del sistema | Usuario, password, nombre, rol, sucursal, estado |
| `Utilitario.jsx` | Configuraciones del sistema | Categorías, marcas, unidades, otros |

---

## 🌐 CMS — Gestión de Contenido Web

Módulo para administrar el contenido del sitio web público.

| Componente | Descripción | Campos principales |
|---|---|---|
| `WebMenu.jsx` | Menú de navegación web | Ubicación, título, title, orden, URL, PHP, clase CSS, mostrar |
| `WebPagina.jsx` | Páginas del sitio web | Menú, título, subtítulo, autor, detalle, imagen 1000x300, URL, keywords |
| `Comentario.jsx` | Moderación de comentarios | Fecha, nombre, email, comentario, estado (Aprobado/Pendiente/Rechazado) |
| `WebBanner.jsx` | Banners del sitio | Título, subtítulo, detalle, imagen JPG/GIF/PNG 1000x300px, orden |
| `WebVisita.jsx` | Registro de visitas web | Fecha, hora, IP origen, página destino, total de visitas |

---

## 🔴 Egresos

Módulo de control de salidas y pagos.

| Componente | Descripción | Campos principales |
|---|---|---|
| `OrdenCompra.jsx` | Órdenes de compra | Proveedor, fecha, artículos, cantidades, precios, estado |
| `Compra.jsx` | Registro de compras | Proveedor, comprobante, fecha, artículos, IGV, total |
| `CtaPagar.jsx` | Cuentas por pagar | Proveedor, factura, monto, fecha vencimiento, estado |
| `CtaPagarLetras.jsx` | Letras por pagar | Proveedor, letra, monto, fecha, estado |
| `Gastos.jsx` | Gastos operativos | Tipo gasto, descripción, monto, fecha, sucursal |

---

## 🟢 Ingresos

### CRM

| Componente | Descripción |
|---|---|
| `Tareas.jsx` | Gestión de tareas y seguimiento comercial con prioridades y estados |
| `Calendario.jsx` | Vista de calendario con eventos y tareas programadas por fecha |
| `Encuesta.jsx` | Creación y gestión de encuestas enviadas a clientes |

### Cuentas por Cobrar

| Componente | Descripción |
|---|---|
| `CtaxCobrar.jsx` | Listado general de todas las cuentas por cobrar activas |
| `CxcCobranza.jsx` | Proceso de cobranza con seguimiento de pagos parciales |
| `CxcContable.jsx` | Vista contable de cuentas con asientos y movimientos |
| `CxcLetras.jsx` | Letras de cambio emitidas pendientes de cobro |
| `CxcPendiente.jsx` | Cuentas vencidas y próximas a vencer |
| `CxcTotal.jsx` | Resumen totalizado por cliente y período |

### Venta

| Componente | Descripción |
|---|---|
| `Venta.jsx` | Registro de ventas con comprobante, cliente, artículos e IGV |
| `ConfirmarPago.jsx` | Confirmación de pagos de ventas a crédito |
| `NotadeCredito.jsx` | Emisión de notas de crédito por devoluciones o descuentos |
| `NotadeDebito.jsx` | Emisión de notas de débito por cargos adicionales |
| `OtrosIngresos.jsx` | Ingresos no relacionados a ventas como alquileres o servicios |
| `CreditoAcumulado.jsx` | Control del crédito acumulado y disponible por cliente |

### Otros Ingresos

| Componente | Descripción |
|---|---|
| `Cotizacion.jsx` | Generación de cotizaciones formales para clientes |
| `PedidoWeb.jsx` | Gestión de pedidos recibidos desde el sitio web |
| `GuiaRemision.jsx` | Emisión de guías de remisión para traslado de mercadería |
| `AlmacenTraslado.jsx` | Traslado de artículos entre sucursales con control de stock |

---

## 📊 Reportes

| Sección | Componentes | Descripción |
|---|---|---|
| **Artículo** | StockGeneral, GeneralXSucursal, Valorizado, CompraVenta, Lotes, Digemid | Reportes de inventario y movimientos de artículos |
| **Caja** | AperturaCaja, MovCaja, TipoPago | Control de apertura, movimientos y tipos de pago en caja |
| **Compras** | General, Detallado | Reporte general y detallado de todas las compras |
| **Ventas** | General, Detallado, Grafico, Estadistica | Análisis de ventas con gráficos y estadísticas |
| **Contable** | Compra, Venta | Reportes contables de compras y ventas con IGV |
| **Otros** | Kardex, MovBancarios, Asistencia, Dashboard | Kardex de artículos, movimientos bancarios y asistencia de personal |

---

## ✅ Funcionalidades Transversales

Todos los módulos ABM comparten estas funcionalidades implementadas en JavaScript puro dentro de React:

### Búsqueda y filtros

```jsx
const registrosFiltrados = registros.filter(r => {
  if (filtro && r.campo !== filtro) return false;
  if (!busqueda) return true;
  return r.nombre.toLowerCase().includes(busqueda.toLowerCase());
});
```

### Exportar a Excel (CSV)

```jsx
const exportarExcel = () => {
  const encabezados = ["Nro", "Nombre", "RUC", "Teléfono"];
  const filas = datos.map((d, i) => [i + 1, d.nombre, d.ruc, d.telefono].join(","));
  const csv  = [encabezados.join(","), ...filas].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const a    = document.createElement("a");
  a.href     = URL.createObjectURL(blob);
  a.download = "reporte.csv";
  a.click();
};
```

### Exportar a Word

```jsx
const exportarWord = () => {
  const html = `<html><body><table>...</table></body></html>`;
  const blob = new Blob([html], { type: "application/msword" });
  const a    = document.createElement("a");
  a.href     = URL.createObjectURL(blob);
  a.download = "reporte.doc";
  a.click();
};
```

### Imprimir

```jsx
const imprimir = () => {
  const win = window.open("", "_blank");
  win.document.write(`<html><head><title>Reporte</title></head>
    <body><table>...</table></body></html>`);
  win.document.close();
  win.print();
};
```

### Mensaje de éxito/error con auto-cierre

```jsx
const showMsg = (tipo, texto) => {
  setMsg({ tipo, texto });
  setTimeout(() => setMsg({ tipo: "", texto: "" }), 2500);
};
```

---

## 🔧 Uso de JavaScript en React

### Hooks utilizados en el proyecto

```jsx
import { useState, useEffect, useRef } from "react";

// useState — manejo de estado local
const [datos, setDatos] = useState([]);

// useEffect — cargar datos al montar el componente
useEffect(() => {
  fetch("/api/clientes")
    .then(res => res.json())
    .then(data => setDatos(data));
}, []);

// useRef — referencia directa a elementos del DOM
const inputRef = useRef(null);
inputRef.current.focus();
```

### Llamadas a la API con fetch

```jsx
// GET — obtener datos
const cargarDatos = async () => {
  const res  = await fetch("/api/clientes", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  const data = await res.json();
  setClientes(data);
};

// POST — crear registro
const crear = async (nuevoCliente) => {
  await fetch("/api/clientes", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(nuevoCliente),
  });
};

// PUT — actualizar registro
const actualizar = async (id, datos) => {
  await fetch(`/api/clientes/${id}`, {
    method:  "PUT",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(datos),
  });
};

// DELETE — eliminar registro
const eliminar = async (id) => {
  await fetch(`/api/clientes/${id}`, { method: "DELETE" });
};
```

### Navegación entre páginas con React Router

```jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Login        from "./pages/Login";
import Dashboard    from "./pages/Reportes/Dashboard";
import Cliente      from "./pages/Abm/Cliente";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/clientes" element={
          <PrivateRoute><Cliente /></PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 🧰 Scripts Disponibles

```bash
# Desarrollo con recarga automática
npm run dev

# Compilar para producción
npm run build

# Previsualizar producción local
npm run preview

# Verificar errores de código con ESLint
npm run lint
```

---

## 🌿 Flujo de trabajo con Git

```bash
# Ver estado de cambios
git status

# Agregar todos los cambios
git add .

# Hacer commit con mensaje descriptivo
git commit -m "feat: descripción del cambio"

# Subir a GitHub
git push origin main

# Bajar cambios del repositorio remoto
git pull origin main
```

### Tipos de commit recomendados

| Prefijo | Uso |
|---|---|
| `feat:` | Nueva funcionalidad |
| `fix:` | Corrección de error |
| `docs:` | Cambios en documentación |
| `style:` | Cambios de estilos CSS |
| `refactor:` | Refactorización de código |
| `chore:` | Tareas de mantenimiento |

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Uso |
|---|---|---|
| React | 18 | Librería principal de UI |
| Vite | 5 | Bundler y servidor de desarrollo |
| JavaScript ES6+ | — | Lógica de negocio y componentes |
| React Router DOM | 6 | Navegación entre páginas |
| Axios | — | Llamadas HTTP a la API |
| Recharts | — | Gráficos en reportes |
| CSS inline | — | Estilos encapsulados por componente |

---

> © 2009 - 2026 **INTELIGENTE** — Todos los derechos reservados
