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
npm create vite@latest Facturacion -- --template react
cd Facturacion
```

### 2. Instalar dependencias base

```bash
npm install
```

### 3. Instalar dependencias adicionales

```bash
npm install react-router-dom
npm install axios
npm install sweetalert2
npm install recharts
npm install react-icons
```

### 4. Crear la estructura de carpetas

```bash
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

### 7. Previsualizar build de producción

```bash
npm run preview
```

---

## 💻 Instalación y Ejecución

Si ya tienes el proyecto clonado desde GitHub:

```bash
git clone https://github.com/EliasG0nzales/Facturacion.git
cd Facturacion
npm install
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

**Características:**
- Validación de campos vacíos
- Manejo de errores de autenticación
- Redirección automática al Dashboard tras login exitoso
- Botón de cerrar sesión que limpia el token

```jsx
// Login.jsx
const handleLogin = async () => {
  if (!usuario || !password) { setError("Complete todos los campos"); return; }
  const res  = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, password }),
  });
  const data = await res.json();
  if (data.token) { localStorage.setItem("token", data.token); window.location.href = "/dashboard"; }
  else setError("Credenciales incorrectas");
};
```

```jsx
// PrivateRoute.jsx
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};
```

---

## 📊 Dashboard

### `Dashboard.jsx`

Pantalla principal tras iniciar sesión. Muestra:

- **Tarjetas de resumen** — ventas del día, compras pendientes, clientes nuevos, stock bajo
- **Gráfico de ventas** — evolución mensual con Recharts
- **Alertas activas** — tareas pendientes y créditos vencidos
- **Accesos rápidos** — botones directos a los módulos más usados

```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const datos = [
  { mes: "Ene", ventas: 4200 },
  { mes: "Feb", ventas: 5800 },
  { mes: "Mar", ventas: 3900 },
];

const GraficoVentas = () => (
  <LineChart width={600} height={300} data={datos}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="mes" /><YAxis /><Tooltip />
    <Line type="monotone" dataKey="ventas" stroke="#17a2b8" strokeWidth={2} />
  </LineChart>
);
```

---

## 🔷 ABM — Altas, Bajas y Modificaciones

### Patrón estándar de un componente ABM

```jsx
const MiModulo = () => {
  const [registros, setRegistros] = useState([]);
  const [form, setForm]           = useState({ campo1: "", campo2: "" });
  const [modal, setModal]         = useState(null); // null | 'nuevo' | 'editar'
  const [msg, setMsg]             = useState({ tipo: "", texto: "" });

  const showMsg = (tipo, texto) => {
    setMsg({ tipo, texto });
    setTimeout(() => setMsg({ tipo: "", texto: "" }), 2500);
  };

  const guardar = () => {
    if (!form.campo1) return showMsg("danger", "El campo es obligatorio");
    if (modal === "nuevo") setRegistros(prev => [...prev, { ...form, id: Date.now() }]);
    else setRegistros(prev => prev.map(r => r.id === form.id ? { ...form } : r));
    showMsg("success", "Guardado correctamente");
    setModal(null);
  };

  const eliminar = (id) => {
    if (window.confirm("¿Eliminar este registro?"))
      setRegistros(prev => prev.filter(r => r.id !== id));
  };
};
```

### Módulos ABM implementados ✅

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

Módulo de control de salidas y pagos. Accesible desde el menú **Egresos**.

---

### 🛒 Orden de Compra — `OrdenCompra.jsx`

Gestión de órdenes de compra emitidas a proveedores antes de registrar la compra formal.

- **Vista Lista:** BUSCAR X con filtros por Proveedor/Fecha, tabla Nro/Proveedor/Fecha/Total/Estado, badges Pendiente/Aprobada/Anulada, ícono ✏ por fila, botones 🖨 / 📊 Excel
- **Vista Nuevo:** selección de Proveedor, Fecha, Moneda, buscador de artículos con cantidad y precio unitario, cálculo automático subtotal/IGV/total, campo Observaciones, botones 💾 Guardar / 🗋 Limpiar / ↩ Regresar
- **Documento imprimible:** Orden de Compra formal con datos del proveedor, tabla de artículos, totales y campo de firma

---

### 🧾 Compra — `Compra.jsx`

Registro de compras con comprobante SUNAT de proveedores.

- **Vista Lista:** filtros por Proveedor/Tipo Comprobante/Fecha, tabla Proveedor/Tipo/Serie/Nro/Fecha/Base/IGV/Total/Estado, fila Total dinámica, badges, ícono ✏ por fila, botones 🖨 / 📊 / 📄
- **Vista Nuevo:** Tipo Comprobante (Factura/Boleta/Ticket/Nota/Liquidación), Proveedor (select con RUC), Serie/Nro, Fecha, Moneda, buscador de artículos con IGV 18%, totales automáticos, tipo de pago Contado/Crédito, campo Glosa
- **Exportación:** CSV con BOM UTF-8 para correcta visualización en Excel

---

### 💳 Cta. x Pagar — `CtaPagar.jsx`

Control de cuentas por pagar a proveedores con seguimiento de vencimientos.

- **Vista Lista:** BUSCAR X con Proveedor + tipo + estado + fechas, tabla Proveedor/Comprobante/Fecha/Vto/Pendiente/Estado, badges Pendiente (naranja) / Pagado (verde) / Vencido (rojo), fila totales S/. y US$.
- **Modal Pagar:** Fecha pago, Monto, Medio de pago (Efectivo/Transferencia/Cheque/Depósito), Referencia, validación de monto vs saldo, actualización de estado automática
- **Características:** ordenamiento por columnas (▲▼), alerta flotante verde/roja auto-cierre 3.5s

---

### 📋 Cta. x Pagar - Letras — `CtaPagarLetras.jsx`

Gestión de letras de cambio emitidas como medio de pago a proveedores.

- **Vista Lista:** tabla Proveedor/Letra Nro/Fecha Emisión/Fecha Vencimiento/Monto/Estado, badges Pendiente/Al Cobro/Protestada/Pagada, filtros por proveedor/estado/fecha, ícono ✏ por fila
- **Modal Editar:** actualización de estado, fecha de pago efectivo, banco y referencia
- **Totales:** monto total de letras pendientes en S/. y US$.

---

### 💸 Gastos — `Gastos.jsx`

Registro de gastos operativos, administrativos y de mantenimiento.

- **Vista Lista:** BUSCAR X por Tipo de Gasto + texto + Fecha Inicio/Fin, tabla Tipo/Fecha/Detalle/Monto S/./Monto US$./Comprobante/Responsable, fila Total dinámica con suma por moneda, ícono ✏ por fila, botones 🖨 / 📊 / 📄
- **Vista Nuevo:** Tipo de Gasto (select con categorías), Fecha ✅ verde, Detalle, Monto S/., Monto US$., Tipo Comprobante, Serie/Nro, Responsable, Observaciones

---

## 🟢 Ingresos

Módulo principal del sistema. Accesible desde el menú **Ingreso**.

---

### 📌 CRM — Gestión de Relaciones con Clientes

Accesible desde **Ingreso › CRM**.

#### 📅 Tareas — `Tareas.jsx`

Gestión de tareas y actividades comerciales del equipo de ventas.

- **Vista Lista:** tabla Asignado/Título/Prioridad/Estado/Fecha Límite/Responsable, badges Prioridad (Alta=rojo/Media=naranja/Baja=verde) y Estado (Pendiente=gris/En Proceso=azul/Completada=verde), filtros por estado/prioridad/responsable/fecha, ícono ✏ por fila
- **Vista Nuevo:** Título, Descripción, Prioridad, Estado, Fecha Límite ✅ verde, Responsable (select usuarios), Observaciones

#### 🗓️ Calendario — `Calendario.jsx`

Vista de calendario mensual con eventos y actividades programadas.

- **Vista Calendario:** navegación por mes con botones ◀ ▶, grid 7 columnas días, celdas con eventos en badges de colores, clic en día para agregar/ver eventos
- **Tipos de evento:** Reunión (azul), Vencimiento (rojo), Tarea (verde), Recordatorio (naranja)
- **Modal Evento:** Título, Fecha, Hora, Tipo, Descripción, Guardar / Eliminar

#### 📊 Encuesta — `Encuesta.jsx`

Creación y gestión de encuestas de satisfacción enviadas a clientes.

- **Vista Lista:** tabla Título/Fecha/Estado/Respuestas/Preguntas, badges Estado (Activa=verde/Cerrada=gris), ícono ✏ editar, ícono 📋 ver resultados
- **Vista Nuevo:** Título, Descripción, Fecha Inicio/Fin, Estado, sección dinámica de Preguntas (Texto/Opción múltiple/Sí-No), agregar/quitar pregunta

---

### 🛍️ Pedido Web — `PedidoWeb.jsx`

Accesible desde **Ingreso › Pedido web**.

Gestión de pedidos recibidos desde el sitio web de la empresa.

- **Vista Lista:** BUSCAR X con Estado + texto + Fecha Inicio/Fin, tabla Nro Pedido/Fecha/Cliente/Email/Teléfono/Total/Estado, badges Nuevo=azul/Procesando=naranja/Enviado=verde/Cancelado=rojo, ícono ✏ por fila
- **Modal Detalle:** datos del cliente, dirección de envío, tabla de artículos pedidos con cantidad y precio, historial de cambios de estado, campo Observaciones internas
- **Acciones:** cambiar estado, generar Venta desde pedido (botón → Venta), imprimir orden

---

### 📄 Cotización — `Cotizacion.jsx`

Accesible desde **Ingreso › Cotizacion**.

Generación de cotizaciones formales para clientes con posibilidad de convertirlas en venta.

- **Vista Lista:** BUSCAR X por Cliente/Vendedor/Estado + fechas, tabla Nro/Fecha/Cliente/Vendedor/Total/Validez/Estado, badges Vigente=verde/Vencida=rojo/Convertida=azul, ícono ✏ por fila, botón → Venta para convertir
- **Vista Nuevo:** Cliente (select RUC), Vendedor, Fecha ✅ verde, Validez días, Moneda, Condición pago, buscador artículos con precio editable, subtotal/IGV 18%/total automáticos, Observaciones/Condiciones
- **Documento imprimible:** Cotización formal con logo empresa, datos del cliente, tabla de artículos, validez, condiciones y campo de firma

---

### 💰 Venta

Sub-módulo de ventas. Accesible desde **Ingreso › Venta**.

#### 🧾 Venta — `Venta.jsx`

Registro principal de ventas con generación de comprobantes electrónicos SUNAT.

- **Vista Lista:** BUSCAR X por Sucursal/Tipo/Cliente/Vendedor + fechas, tabla Sucursal/Tipo/Serie/Nro/Fecha/Cliente/Vendedor/Base/IGV/Total/Estado, badges SUNAT y Estado, fila Total dinámica, 5 íconos por fila, botones 🖨 / 📊 / 📄
- **Vista Nuevo:** Tipo Comprobante (Factura/Boleta/Ticket), Cliente (select + búsqueda RUC/nombre), Vendedor, Fecha ✅ verde, Moneda, Tipo pago Contado/Crédito+días, buscador artículos con stock, IGV 18% automático
- **Documentos generados:** Factura/Boleta electrónica imprimible, Ticket 80mm formato térmica

#### ✅ Confirmar Pago — `ConfirmarPago.jsx`

Accesible desde **Ingreso › Venta › Confirmar Pago Venta**.

Confirmación y registro de pagos de ventas realizadas a crédito.

- **Vista Lista:** tabla Venta Nro/Fecha/Cliente/Total/Pagado/Saldo/Estado, badges Pendiente (naranja) / Pagado (verde) / Parcial (azul), filtros por cliente/estado/fecha, fila Totales
- **Modal Confirmar Pago:** Fecha pago ✅ verde, Monto, Método (Efectivo/Transferencia/Cheque/Depósito/Tarjeta), Banco, Referencia, validación automática, actualización de estado al completar

#### 📈 Nota de Débito — `NotaDebito.jsx`

Accesible desde **Ingreso › Venta › Nota de Debito**.

Emisión de notas de débito electrónicas según normativa SUNAT.

- **Vista Lista:** tabla Guía Nro/Fecha/Comprobante Ref./Cliente/Motivo/Monto/Estado, badges SUNAT y Estado, íconos ✏ / 🖨 / `</>` XML / 📖 Portal SUNAT
- **Vista Nuevo:** referencia a comprobante original, Cliente, Fecha ✅ verde, **8 motivos SUNAT:** Mora / Aumento de valor / Penalidades / Gastos incurridos por el comprador / Diferencia de cambio / Otros conceptos / Cargos por garantía / Gastos de cobranza, Monto, IGV, Total
- **Documentos:** Nota de Débito imprimible + XML DespatchAdvice SUNAT descargable

#### 📉 Nota de Crédito — `NotaCredito.jsx`

Accesible desde **Ingreso › Venta › Nota de Credito**.

Emisión de notas de crédito electrónicas según normativa SUNAT.

- **Vista Lista:** tabla Nro/Fecha/Comprobante Ref./Cliente/Motivo/Monto/Estado, íconos ✏ / 🖨 / `</>` XML / 📖 Portal SUNAT
- **Vista Nuevo:** referencia a comprobante original, Cliente, Fecha ✅ verde, **8 motivos SUNAT:** Anulación de la operación / Error en el RUC / Anulación error en descripción / Anulación error en IGV / Devolución / Descuentos / Bonificación / Disminución en el valor, Monto, IGV, Total
- **Documentos:** Nota de Crédito imprimible + XML SUNAT descargable

#### 💵 Otros Ingresos — `OtrosIngresos.jsx`

Accesible desde **Ingreso › Venta › Otros Ingresos**.

Registro de ingresos no relacionados a ventas de artículos.

- **Vista Lista:** BUSCAR X con DE/Motivo/Fecha, tabla Fecha/A/Detalle/Tipo/Moneda/Monto S/./Monto US$., fila Total por moneda, ícono ✏ por fila, botones 🖨 / 📊 / 📄
- **Vista Nuevo:** formulario en fila horizontal — Fecha ✅ verde, A (destinatario), Detalle, Tipo (General/Adelanto/Depósito/Préstamo/Alquiler/Otros), Moneda (S/./US$.), Monto
- **Totales:** suma dinámica en ambas monedas al pie de tabla

#### 🏅 Crédito Acumulado — `CreditoAcumulado.jsx`

Accesible desde **Ingreso › Venta › Credito acumulado**.

Control del crédito acumulado por cliente con 10 acciones por comprobante.

- **Vista Lista:** BUSCAR X por Sucursal/Tipo/Cliente/Vendedor + fechas, tabla Sucursal/Tipo/Serie/Nro/Fecha/Cliente/Vendedor/Base/IGV/Total, badges SUNAT (Pendiente/Enviado/Aceptado) y Estado (Vigente/Anulado), fila Total dinámica
- **10 íconos de acción por fila:**
  - ✏ Editar / Eliminar comprobante
  - **ND** Generar Nota de Débito desde este comprobante
  - **NC** Generar Nota de Crédito desde este comprobante
  - 🖨 Ticket 80mm formato térmica
  - ↺ Convertir en nueva Cotización
  - 👤 Ficha completa del cliente
  - **VTA** Generar nueva Venta para el mismo cliente
  - 📄 PDF Factura Electrónica imprimible
  - `</>` XML SUNAT DespatchAdvice descargable
  - 📖 Consultar en Portal SUNAT

---

### 🏦 Cta. x Cobrar

> ⚠️ **En integración** — Este sub-módulo está siendo desarrollado por otro miembro del equipo.

Accesible desde **Ingreso › Cta. x Cobrar**.

| Componente | Descripción | Estado |
|---|---|---|
| `CtaxCobrar.jsx` | Listado general de cuentas por cobrar activas con saldos | 🔧 En desarrollo |
| `CxcLetras.jsx` | Letras de cambio emitidas pendientes de cobro | 🔧 En desarrollo |
| `CxcPendiente.jsx` | Cuentas vencidas y próximas a vencer con alertas | 🔧 En desarrollo |
| `CxcTotal.jsx` | Resumen totalizado por cliente y período | 🔧 En desarrollo |
| `CxcCobranza.jsx` | Proceso de cobranza con seguimiento de pagos parciales | 🔧 En desarrollo |
| `CxcContable.jsx` | Vista contable con asientos y movimientos por cobrar | 🔧 En desarrollo |

---

### 🚚 Guía de Remisión — `GuiaRemision.jsx`

Accesible desde **Ingreso › Guia Remision**.

Emisión y control de guías de remisión electrónicas para traslado de mercadería según normativa SUNAT.

- **Vista Lista:** BUSCAR X por Sucursal/Guía Nro/Cliente + fechas, tabla Sucursal/Guia Nro/Fecha/Doc.Venta/Tip.Traslado/Cliente/Estado/SUNAT, badges Estado (Vigente/Anulada) y SUNAT (Pendiente/Enviada/Aceptada), ordenamiento por columnas (▲▼), 5 íconos por fila, botones 🖨 / 📊 / 📄
- **5 íconos por fila:** ✏ Editar/Eliminar · 📦 Guía imprimible · 🖨 Ticket 80mm · `</>` XML SUNAT · 📖 Portal SUNAT
- **Vista Detalle:** tabla extendida con 14 columnas incluyendo datos de entrega, traslado, transportista y artículos, exportación CSV con BOM UTF-8
- **Vista Nuevo — Formulario completo:**
  - **Documento de Salida:** Nro Guía (select GR Electrónica TI01 + campo numérico), Fecha Entrega ✅ verde, Fecha Traslado ✅ verde, Documento (Factura/Boleta), Serie, Nro
  - **Domicilio de Partida:** Dirección (fondo verde readonly), Departamento (25 departamentos del Perú), Provincia, Distrito
  - **Domicilio de Llegada:** Dirección, Departamento, Provincia, Distrito
  - **Datos comerciales:** Cliente (select), Vendedor, Trasbordo (Sí/No)
  - **Información de Transporte:** Modo Traslado (Público/Privado), Vehículo/Placa, Certificado, Licencia, Nombre o Empresa Conductor, DNI/RUC, Costo Mínimo
  - **Información Adicional:** Orden, Atención, Condiciones, A Días, Tipo Traslado, Puerto
  - **Búsqueda de artículos:** `BuscadorArticulos` (componente externo) con radios Nombre/Marca/Línea/Cat./Código/C.Barra, buscador fondo verde, tabla Código/Artículo/Stock/Med./P-M/C/P.Venta/Cant./T.A.IGV/✔, artículos agregados con botón ✕ quitar

**Documentos generados:**
- 📦 **Guía de Remisión** — documento completo con datos del remitente, domicilios, transportista, placa, tabla de artículos y 3 campos de firma
- 🖨 **Ticket 80mm** — versión compacta para impresora térmica
- `</>` **XML SUNAT** — formato DespatchAdvice descargable como `.xml`
- 📖 **Portal SUNAT** — visualización con hash de verificación simulado

---

### 🏪 Almacén: Traslado de Artículos — `AlmacenTraslado.jsx`

Accesible desde **Ingreso › Almacen : Traslado articulo**.

Módulo para trasladar artículos entre sucursales con generación de guía de remisión interna.

- **Vista Lista:** título "Almacén: traslado de artículos" con ícono ℹ azul
  - **BUSCAR X:** filtro Origen/Destino + select Sucursal (Todos / Tienda 1b 133 / Tienda 1A 119 / Almacen 2B 167) + y/o tipo (Artículo/Marca/Categoría/Código/C.Barra/Nro Guía) + input búsqueda + Fecha Inicio/Fin + botón 🔍 Buscar + botón **+1** (azul)
  - **Tabla:** columnas GUIA / FECHA ENT. / FECHA TRA. / RES. / DE / A / ARTÍCULO / CANTIDAD / opciones
  - **Fila Total** dinámica al pie con suma de cantidades
  - Ícono ✏ por fila → modal Actualizar / Eliminar
  - Botones: 🖨 Imprimir / 📊 Excel / 📄 PDF

- **Vista Nuevo (botón +1) — TRASLADO ENTRE ALMACEN : CON GUIA DE REMISION:**
  - **Documento de salida:** Nro Guía (select GR TI01 + campo), Fecha Entrega ✅ verde, Fecha Traslado ✅ verde
  - **Origen (de):** panel fondo gris con label "Tienda 1b 133" en azul, Dirección y Distrito en fondo verde readonly precargado
  - **Destino (a):** select con sucursales destino disponibles
  - **Vehículo:** Placa, Certificado, Licencia (panel izquierdo)
  - **Transportista / Costo:** Nombre, RUC, Costo Mínimo (panel derecho)
  - **Búsqueda de artículos:** radios Nombre/Marca/Linea/Cat./Código/C.Barra/Serie + buscador fondo verde + tabla Código/Artículo/Stock/Med./Cant./✔
  - **Artículos agregados:** tabla con seleccionados + botón ✕ quitar por fila
  - **Botones:** 💾 Guardar / 🗋 Limpiar / ↩ Regresar

**Sucursales disponibles:** Tienda 1b 133 · Tienda 1A 119 · Almacen 2B 167

---

## 📊 Reportes

| Sección | Componentes | Descripción |
|---|---|---|
| **Artículo** | StockGeneral, GeneralXSucursal, Valorizado, CompraVenta, Lotes, Digemid | Reportes de inventario y movimientos de artículos |
| **Caja** | AperturaCaja, MovCaja, TipoPago | Control de apertura, movimientos y tipos de pago en caja |
| **Compras** | General, Detallado | Reporte general y detallado de todas las compras |
| **Ventas** | General, Detallado, Grafico, Estadistica | Análisis de ventas con gráficos y estadísticas |
| **Contable** | Compra, Venta | Reportes contables de compras y ventas con IGV |
| **Otros** | Kardex, MovBancarios, Asistencia, Dashboard | Kardex de artículos, movimientos bancarios y asistencia |

---

## ✅ Funcionalidades Transversales

Todos los módulos comparten estas implementaciones en JavaScript/React:

### DatePicker personalizado con ícono de calendario SVG

```jsx
const IcoCal = () => (
  <svg width="18" height="18" viewBox="0 0 36 36" fill="none">
    <rect x="1" y="4" width="34" height="30" rx="3" fill="#fff" stroke="#bbb" strokeWidth="1.5"/>
    <rect x="1" y="4" width="34" height="9" rx="3" fill="#e74c3c"/>
    <rect x="1" y="9" width="34" height="4" fill="#e74c3c"/>
    <rect x="10" y="1" width="3" height="7" rx="1.5" fill="#888"/>
    <rect x="23" y="1" width="3" height="7" rx="1.5" fill="#888"/>
  </svg>
);

// Fondo verde = fecha requerida | Fondo blanco = fecha opcional
const DP = ({ value, onChange, verde }) => {
  const ref = useRef();
  return (
    <div style={{ border: verde ? "2px solid #28a745" : "1px solid #ced4da",
      background: verde ? "#ccff99" : "#fff", borderRadius: 4,
      padding: "4px 8px", display: "inline-flex", alignItems: "center", gap: 4 }}
      onClick={() => ref.current.showPicker?.() ?? ref.current.click()}>
      <span>{value ? value.split("-").reverse().join("/") : ""}</span>
      <IcoCal />
      <input ref={ref} type="date" value={value} onChange={e => onChange(e.target.value)}
        style={{ opacity: 0, width: 1, height: 1, position: "absolute" }} />
    </div>
  );
};
```

### Alerta flotante con auto-cierre

```jsx
const showAlert = (msg) => {
  setAlert(msg);
  setTimeout(() => setAlert(""), 3500);
};

// JSX — alerta top-right, color según prefijo "ok:" o "err:"
{alert && (
  <div style={{ position:"fixed", top:70, right:20, zIndex:9999,
    background: alert.startsWith("ok:") ? "#28a745" : "#dc3545",
    color:"#fff", padding:"10px 18px", borderRadius:6 }}>
    {alert.startsWith("ok:") ? "✅ " : "⚠️ "}{alert.slice(3)}
  </div>
)}
```

### Documento imprimible en ventana nueva

```jsx
const abrirVentana = (html) => {
  const w = window.open("", "_blank", "width=900,height=700,scrollbars=yes");
  w.document.write(html);
  w.document.close();
};

const htmlDoc = (titulo, colorHead, contenido) => `
  <!DOCTYPE html><html>
  <head>
    <meta charset="UTF-8"><title>${titulo}</title>
    <style>
      body { font-family: Arial, sans-serif; font-size: 13px; margin: 20px; }
      .head { background: ${colorHead}; color: #fff; padding: 12px 18px; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #dee2e6; padding: 6px 10px; }
      @media print { .no-print { display: none !important; } }
    </style>
  </head>
  <body>${contenido}</body></html>`;
```

### Descarga de XML SUNAT

```jsx
const descargarXML = (g) => {
  const xml  = `<?xml version="1.0" encoding="UTF-8"?>
<DespatchAdvice xmlns="urn:oasis:names:specification:ubl:schema:xsd:DespatchAdvice-2">
  <ID>${g.guia}</ID>
  <IssueDate>${g.fecha}</IssueDate>
  <Shipment>
    <TransportMeans>
      <RoadTransport><LicensePlateID>${g.placa}</LicensePlateID></RoadTransport>
    </TransportMeans>
  </Shipment>
</DespatchAdvice>`;
  const blob = new Blob([xml], { type: "application/xml" });
  const a    = document.createElement("a");
  a.href     = URL.createObjectURL(blob);
  a.download = `${g.guia}.xml`;
  a.click();
  URL.revokeObjectURL(a.href);
};
```

### Exportar a Excel — CSV con BOM UTF-8

```jsx
const exportarExcel = (datos, nombre) => {
  const cab  = ["Nro", "Fecha", "Cliente", "Total"].join(",");
  const fils = datos.map((d, i) => [i+1, d.fecha, d.cliente, d.total].join(","));
  const csv  = [cab, ...fils].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const a    = document.createElement("a");
  a.href     = URL.createObjectURL(blob);
  a.download = `${nombre}.csv`;
  a.click();
};
```

### Búsqueda y filtros en tiempo real

```jsx
const filtrados = registros.filter(r => {
  if (filtroTipo && r.tipo !== filtroTipo) return false;
  if (!busqueda) return true;
  return r.nombre.toLowerCase().includes(busqueda.toLowerCase())
      || r.ruc?.includes(busqueda);
});
```

### Componentes con hooks — regla clave

```jsx
// CORRECTO — componente con hooks declarado FUERA del export default
function BuscadorArticulos({ onAgregar }) {
  const [tipo, setTipo]   = useState("Nombre");
  const [query, setQuery] = useState("");
  // ...
}

// INCORRECTO — nunca declarar componentes con hooks DENTRO de otro componente
export default function MiModulo() {
  function BuscadorArticulos() { const [x, setX] = useState(); } // ERROR de React
}
```

### Modales — renderModal en lugar de IIFE

```jsx
// CORRECTO — función renderModal separada
const renderModal = () => {
  if (!modal) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.45)", zIndex:1000 }}>
      {/* contenido del modal */}
    </div>
  );
};

// INCORRECTO — nunca usar IIFE dentro del JSX
return <div>{(() => { return <Modal /> })()}</div>; // Causa errores de compilación
```

---

## 🔧 Uso de JavaScript en React

### Hooks utilizados en el proyecto

```jsx
import { useState, useEffect, useRef } from "react";

const [datos, setDatos] = useState([]);   // estado local
const inputRef          = useRef(null);   // referencia DOM

useEffect(() => {                          // efecto al montar
  fetch("/api/datos").then(r => r.json()).then(setDatos);
}, []);
```

### Llamadas a la API

```jsx
// GET
const res  = await fetch("/api/clientes", {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});
const data = await res.json();

// POST / PUT / DELETE
await fetch(`/api/clientes/${id}`, {
  method:  "PUT",
  headers: { "Content-Type": "application/json" },
  body:    JSON.stringify(datosActualizados),
});
```

### Navegación con React Router

```jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"     element={<Login />} />
        <Route path="/"          element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/venta"     element={<PrivateRoute><Venta /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 🧰 Scripts Disponibles

```bash
npm run dev      # Desarrollo con recarga automática → http://localhost:5173
npm run build    # Compilar para producción → /dist
npm run preview  # Previsualizar build de producción
npm run lint     # Verificar errores con ESLint
```

---

## 🌿 Flujo de trabajo con Git

```bash
git status                           # Ver cambios pendientes
git add .                            # Agregar todos los cambios
git commit -m "feat: descripción"    # Commit con mensaje descriptivo
git pull origin main --rebase        # Bajar cambios remotos (evita conflictos de merge)
git push origin main                 # Subir al repositorio
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
