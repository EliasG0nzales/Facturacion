# 🧾 FACTURACIÓN — Sistema de Administración Web

Sistema de gestión empresarial desarrollado en **React + Vite**, que cubre módulos de ABM, Egresos, Ingresos, Reportes y CMS Web.

---

## 🛠️ Tecnologías Utilizadas

- **React 18** — Componentes de interfaz
- **Vite** — Bundler y servidor de desarrollo
- **JavaScript JSX** — Lógica y vistas
- **CSS inline / módulos** — Estilos por componente

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
├── App.jsx
├── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## 📦 Módulos del Sistema

### 🔷 ABM — Altas, Bajas y Modificaciones

Gestión de los maestros principales del sistema. Cada módulo incluye listado con filtros, formulario de carga, edición, eliminación y exportación en Imprimir / Excel / Word.

| Componente | Descripción |
|---|---|
| `Cliente.jsx` | Gestión de clientes con búsqueda por tipo, RUC y nombre. Soporta modalidad crédito y contado |
| `Proveedor.jsx` | Registro de proveedores con RUC, contacto y tipo |
| `Articulos.jsx` | Catálogo de artículos con stock por sucursal, precios, imágenes, insumos y reportes de ventas y compras |
| `Servicios.jsx` | Registro de servicios ofrecidos por la empresa |
| `Sucursal.jsx` | Alta y configuración de sucursales |
| `SucursalDocumentos.jsx` | Documentos habilitados por sucursal como facturas y boletas |
| `TipodeCambio.jsx` | Registro diario del tipo de cambio USD/PEN |
| `Usuarios.jsx` | Gestión de usuarios del sistema con roles y permisos |
| `Utilitario.jsx` | Configuraciones y herramientas auxiliares del sistema |

---

### 🌐 CMS — Gestión de Contenido Web

Módulo para administrar el contenido del sitio web público de la empresa.

| Componente | Descripción |
|---|---|
| `WebMenu.jsx` | Administración del menú de navegación web. Permite definir ubicación, título, URL, archivo PHP, ícono CSS, orden y visibilidad. Badge clicable para activar o desactivar ítems |
| `WebPagina.jsx` | Gestión de páginas web con título, subtítulo, autor, contenido HTML, imagen de 1000x300px, posición de imagen, URL y keywords |
| `Comentario.jsx` | Moderación de comentarios recibidos desde el sitio web. Filtro por rango de fechas con selector de calendario. Permite aprobar, rechazar o eliminar comentarios |
| `WebBanner.jsx` | Administración de banners del sitio. Formulario con título, subtítulo, detalle, carga de imagen JPG/GIF/PNG de 1000x300px y orden de aparición |
| `WebVisita.jsx` | Registro de visitas web entrantes. Muestra fecha, hora, IP de origen y página de destino. Filtro por texto y rango de fechas con total de visitas al pie |

---

### 🔴 Egresos

Módulo de control de salidas y pagos de la empresa.

| Componente | Descripción |
|---|---|
| `OrdenCompra.jsx` | Generación y seguimiento de órdenes de compra a proveedores |
| `Compra.jsx` | Registro de compras con detalle de artículos, impuestos y proveedor |
| `CtaPagar.jsx` | Control de cuentas por pagar a proveedores |
| `CtaPagarLetras.jsx` | Gestión de letras de cambio por pagar |
| `Gastos.jsx` | Registro de gastos operativos y administrativos |

---

### 🟢 Ingresos

Módulo de control de entradas, ventas y cobranzas.

**CRM**

| Componente | Descripción |
|---|---|
| `Tareas.jsx` | Gestión de tareas y seguimiento comercial |
| `Calendario.jsx` | Vista de calendario con eventos y tareas programadas |
| `Encuesta.jsx` | Creación y gestión de encuestas a clientes |

**Cuentas por Cobrar**

| Componente | Descripción |
|---|---|
| `CtaxCobrar.jsx` | Listado general de cuentas por cobrar |
| `CxcCobranza.jsx` | Gestión del proceso de cobranza |
| `CxcContable.jsx` | Vista contable de cuentas por cobrar |
| `CxcLetras.jsx` | Letras de cambio por cobrar |
| `CxcPendiente.jsx` | Cuentas pendientes de cobro |
| `CxcTotal.jsx` | Resumen totalizado de cuentas por cobrar |

**Venta**

| Componente | Descripción |
|---|---|
| `Venta.jsx` | Registro de ventas con detalle de artículos, cliente y tipo de comprobante |
| `ConfirmarPago.jsx` | Confirmación y registro de pagos de ventas a crédito |
| `NotadeCredito.jsx` | Emisión de notas de crédito |
| `NotadeDebito.jsx` | Emisión de notas de débito |
| `OtrosIngresos.jsx` | Registro de ingresos no relacionados a ventas directas |
| `CreditoAcumulado.jsx` | Control del crédito acumulado por cliente |

**Otros**

| Componente | Descripción |
|---|---|
| `Cotizacion.jsx` | Generación de cotizaciones para clientes |
| `PedidoWeb.jsx` | Gestión de pedidos recibidos desde la web |
| `GuiaRemision.jsx` | Emisión de guías de remisión |
| `AlmacenTraslado.jsx` | Traslado de artículos entre sucursales |

---

### 📊 Reportes

Módulo de reportes y estadísticas del sistema.

| Sección | Componentes |
|---|---|
| **Artículo** | StockGeneral, GeneralXSucursal, Valorizado, CompraVenta, Lotes, Digemid |
| **Caja** | AperturaCaja, MovCaja, TipoPago |
| **Compras** | General, Detallado |
| **Ventas** | General, Detallado, Grafico, Estadistica |
| **Contable** | Compra, Venta |
| **Otros** | Kardex, MovBancarios, Asistencia, Dashboard |

---

## ✅ Funcionalidades Transversales

Todos los módulos ABM comparten las siguientes funcionalidades estándar:

- 🔍 **Búsqueda y filtros** por múltiples campos
- ➕ **Alta** de registros mediante modal o formulario de página completa
- ✏️ **Edición** de registros existentes
- 🗑️ **Eliminación** con confirmación
- 🖨️ **Imprimir** listado en nueva ventana formateada
- 📗 **Exportar a Excel** en formato CSV con codificación UTF-8
- 📘 **Exportar a Word** en formato .doc con tabla HTML
- 💬 **Mensajes de éxito y error** con auto-cierre a los 2.5 segundos

---

## 🚀 Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build
```

---

> © 2009 - 2026 **INTELIGENTE** — Todos los derechos reservados
---

> © 2009 - 2026 **INTELIGENTE** — Todos los derechos reservados
 
 
