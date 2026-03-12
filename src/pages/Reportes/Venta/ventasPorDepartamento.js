/**
 * Datos compartidos de ventas por departamento.
 * Usado por Reporte Gráfico (por departamentos) y Reporte General.
 * Reemplazar con llamada a API real en producción.
 */

export const DEPARTAMENTOS_PERU = [
  "Amazonas", "Ancash", "Apurimac", "Arequipa", "Ayacucho", "Cajamarca",
  "Callao", "Cusco", "Huancavelica", "Huánuco", "Ica", "Junin",
  "La Libertad", "Lambayeque", "Lima", "Loreto", "Madre de Dios", "Moquegua",
  "Pasco", "Piura", "Puno", "San Martin", "Tacna", "Tumbes", "Ucayali",
];

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i) | 0;
  return Math.abs(h);
}

export function generarVentasPorDepartamento() {
  const ventas = [];
  let docNum = 33;
  const clientesEjemplo = [
    "Comercial", "Distribuidora", "Importadora", "Mayorista", "Minorista",
    "Ferretería", "Bodega", "Farmacia", "Electrónica", "Textil",
  ];
  const vendedores = ["usuario", "Alexander", "Smith", "Raysa"];
  const tiposVenta = ["Contado Efectivo", "Credito", "Contado Tarjeta"];

  DEPARTAMENTOS_PERU.forEach((dep, idx) => {
    const seed = hashStr(dep);
    const numVentas = 2 + (seed % 4);
    const baseMonto = 3000 + (idx * 900) + (seed % 8000);
    for (let i = 0; i < numVentas; i++) {
      const pseudoRand = (seed * (i + 1) * 31) % 1000 / 1000;
      const soles = Math.round((baseMonto * (0.4 + pseudoRand * 0.5)) * 100) / 100;
      const esCredito = (seed + i) % 3 === 0;
      ventas.push({
        doc: `B::BI01-0000${docNum++}`,
        fecha: `${String(1 + (i % 28)).padStart(2, "0")}/03/2026(${10 + i}:${(30 + i) % 60}:00)`,
        cliente: `${clientesEjemplo[idx % clientesEjemplo.length]} ${dep} ${i + 1}`,
        ruc: String(20000000000 + idx * 1000000 + i).slice(0, 11),
        vendedor: vendedores[i % vendedores.length],
        tventa: esCredito ? "Credito" : tiposVenta[i % 3],
        dolares: 0,
        soles,
        tipo: esCredito ? "Credito" : "Contado",
        departamento: dep,
      });
    }
  });
  return ventas;
}

export const VENTAS_DATA = generarVentasPorDepartamento();

/** Totales por departamento (suma de soles) para el reporte gráfico */
export function getTotalesPorDepartamento() {
  const totales = {};
  DEPARTAMENTOS_PERU.forEach((dep) => {
    totales[dep] = VENTAS_DATA
      .filter((v) => v.departamento === dep)
      .reduce((sum, v) => sum + v.soles, 0);
  });
  return totales;
}

export function normalizarDepto(s) {
  const t = (s || "").toLowerCase().trim();
  return t.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
