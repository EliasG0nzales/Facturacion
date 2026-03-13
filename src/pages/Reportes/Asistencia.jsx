import React, { useEffect, useMemo, useState } from "react";
import { Search, CalendarDays, ThumbsUp, ChevronLeft, ChevronRight } from "lucide-react";

const dataA = [
  ["fac-tura.com", "::1", "16/09/2019", "20:27"],
  ["fac-tura.com", "::1", "20/01/2021", "12:56"],
  ["fac-tura.com", "::1", "22/01/2021", "19:48"],
  ["fac-tura.com", "::1", "23/01/2021", "15:49"],
  ["fac-tura.com", "::1", "25/01/2021", "21:44"],
  ["fac-tura.com", "::1", "27/01/2021", "23:54"],
  ["fac-tura.com", "::1", "07/02/2021", "10:47"],
  ["fac-tura.com", "::1", "14/06/2021", "11:33"],
  ["fac-tura.com", "::1", "15/06/2021", "11:23"],
  ["fac-tura.com", "::1", "13/08/2021", "17:14"],
  ["fac-tura.com", "::1", "19/08/2021", "21:18"],
  ["fac-tura.com", "190.233.58.89", "15/12/2023", "22:25"],
  ["fac-tura.com", "38.43.130.119", "16/12/2023", "10:31"],
  ["fac-tura.com", "38.25.12.189", "18/12/2023", "13:41"],
  ["fac-tura.com", "38.43.130.119", "27/12/2023", "17:54"],
  ["Romero, Merino, Alexander Renson", "200.121.132.145", "27/12/2023", "18:05"],
  ["fac-tura.com", "38.43.130.187", "30/12/2023", "10:39"],
  ["fac-tura.com", "38.43.130.187", "08/01/2024", "17:53"],
  ["fac-tura.com", "38.43.130.187", "13/01/2024", "11:26"],
  ["fac-tura.com", "38.43.130.187", "16/01/2024", "14:08"],
  ["fac-tura.com", "38.43.130.187", "22/01/2024", "14:49"],
  ["fac-tura.com", "38.43.130.187", "23/01/2024", "10:48"],
  ["fac-tura.com", "132.251.1.116", "25/01/2024", "10:20"],
  ["fac-tura.com", "38.43.130.187", "26/01/2024", "15:21"],
  ["Merino, Cahuna, Wilver Enmanuel", "38.43.130.187", "26/01/2024", "18:15"],
  ["fac-tura.com", "38.43.130.187", "27/01/2024", "13:36"],
  ["fac-tura.com", "38.43.130.187", "29/01/2024", "11:26"],
  ["Romero, Merino, Alexander Renson", "38.43.130.187", "29/01/2024", "18:02"],
  ["fac-tura.com", "170.246.58.51", "30/01/2024", "15:02"],
  ["Romero, Merino, Alexander Renson", "170.246.58.51", "30/01/2024", "19:01"],
  ["Merino, Cahuna, Wilver Enmanuel", "170.246.58.51", "30/01/2024", "19:31"],
  ["fac-tura.com", "132.191.2.61", "01/02/2024", "10:21"],
  ["fac-tura.com", "170.246.58.51", "02/02/2024", "12:53"],
  ["fac-tura.com", "38.43.130.119", "03/02/2024", "13:19"],
  ["fac-tura.com", "38.43.130.119", "04/02/2024", "14:12"],
  ["fac-tura.com", "38.43.130.119", "05/02/2024", "10:43"],
  ["fac-tura.com", "38.43.130.119", "06/02/2024", "12:07"],
  ["Merino, Cahuna, Wilver Enmanuel", "38.43.130.119", "06/02/2024", "19:20"],
  ["fac-tura.com", "38.43.130.119", "08/02/2024", "13:53"],
  ["fac-tura.com", "38.43.130.119", "09/02/2024", "11:26"],
  ["fac-tura.com", "132.251.3.43", "10/02/2024", "10:53"],
  ["fac-tura.com", "38.43.130.119", "11/02/2024", "10:37"],
  ["fac-tura.com", "38.25.27.103", "12/02/2024", "09:17"],
  ["fac-tura.com", "38.43.130.119", "13/02/2024", "11:46"],
  ["Merino, Cahuna, Wilver Enmanuel", "38.43.130.119", "13/02/2024", "12:00"],
  ["fac-tura.com", "38.43.130.119", "16/02/2024", "15:45"],
  ["fac-tura.com", "38.43.130.119", "17/02/2024", "11:14"],
  ["fac-tura.com", "38.43.130.119", "19/02/2024", "16:39"],
  ["fac-tura.com", "38.43.130.119", "20/02/2024", "11:12"],
  ["fac-tura.com", "38.43.130.119", "21/02/2024", "11:02"],
  ["fac-tura.com", "38.43.130.119", "22/02/2024", "11:39"],
  ["fac-tura.com", "38.43.130.119", "23/02/2024", "18:59"],
  ["fac-tura.com", "38.43.130.119", "24/02/2024", "16:18"],
  ["fac-tura.com", "38.43.130.119", "26/02/2024", "13:11"],
  ["fac-tura.com", "38.43.130.119", "27/02/2024", "14:06"],
  ["fac-tura.com", "38.43.130.119", "01/03/2024", "16:13"],
  ["Merino, Cahuna, Wilver Enmanuel", "38.43.130.119", "01/03/2024", "16:43"],
  ["fac-tura.com", "38.43.130.119", "02/03/2024", "10:26"],
  ["fac-tura.com", "132.184.130.186", "05/03/2024", "10:13"],
].map(([usuario, ip, fecha, horaIngreso]) => ({ usuario, ip, fecha, horaIngreso, refSalida: "", refEntrada: "", horaSalida: "" }));

const dataB = [
  ["Yupanqui, Barboza, Raysa", "179.6.169.39", "28/02/2026", "01:34"],
  ["Yupanqui, Barboza, Raysa", "38.43.130.189", "03/03/2026", "16:34"],
  ["Yupanqui, Barboza, Raysa", "38.43.130.189", "04/03/2026", "17:36"],
  ["Yupanqui, Barboza, Raysa", "38.43.130.189", "06/03/2026", "13:49"],
  ["Yupanqui, Barboza, Raysa", "38.43.130.189", "07/03/2026", "11:11"],
].map(([usuario, ip, fecha, horaIngreso]) => ({ usuario, ip, fecha, horaIngreso, refSalida: "", refEntrada: "", horaSalida: "" }));

const dataC = [
  ["fac-tura.com", "::1", "16/09/2019", "20:27"],
  ["fac-tura.com", "::1", "20/01/2021", "12:56"],
  ["fac-tura.com", "::1", "22/01/2021", "19:48"],
  ["fac-tura.com", "::1", "23/01/2021", "15:49"],
  ["fac-tura.com", "::1", "25/01/2021", "21:44"],
  ["fac-tura.com", "::1", "27/01/2021", "23:54"],
  ["fac-tura.com", "::1", "07/02/2021", "10:47"],
  ["fac-tura.com", "::1", "14/06/2021", "11:33"],
  ["fac-tura.com", "::1", "15/06/2021", "11:23"],
  ["fac-tura.com", "::1", "13/08/2021", "17:14"],
  ["fac-tura.com", "::1", "19/08/2021", "21:18"],
  ["fac-tura.com", "190.233.58.89", "15/12/2023", "22:25"],
  ["fac-tura.com", "38.43.130.119", "16/12/2023", "10:31"],
  ["fac-tura.com", "38.25.12.189", "18/12/2023", "13:41"],
  ["fac-tura.com", "38.43.130.119", "27/12/2023", "17:54"],
  ["fac-tura.com", "38.43.130.187", "30/12/2023", "10:39"],
  ["fac-tura.com", "38.43.130.187", "08/01/2024", "17:53"],
  ["fac-tura.com", "38.43.130.187", "13/01/2024", "11:26"],
  ["fac-tura.com", "38.43.130.187", "16/01/2024", "14:08"],
  ["fac-tura.com", "38.43.130.187", "22/01/2024", "14:49"],
  ["fac-tura.com", "38.43.130.187", "23/01/2024", "10:48"],
  ["fac-tura.com", "132.251.1.116", "25/01/2024", "10:20"],
  ["fac-tura.com", "38.43.130.187", "26/01/2024", "15:21"],
  ["Merino, Cahuna, Wilver Enmanuel", "38.43.130.187", "26/01/2024", "18:15"],
  ["fac-tura.com", "38.43.130.187", "27/01/2024", "13:36"],
  ["fac-tura.com", "38.43.130.187", "29/01/2024", "11:26"],
  ["fac-tura.com", "170.246.58.51", "30/01/2024", "15:02"],
  ["Merino, Cahuna, Wilver Enmanuel", "170.246.58.51", "30/01/2024", "19:31"],
  ["fac-tura.com", "132.191.2.61", "01/02/2024", "10:21"],
  ["fac-tura.com", "170.246.58.51", "02/02/2024", "12:53"],
  ["fac-tura.com", "38.43.130.119", "03/02/2024", "13:19"],
  ["fac-tura.com", "38.43.130.119", "04/02/2024", "14:12"],
  ["fac-tura.com", "38.43.130.119", "05/02/2024", "10:43"],
  ["fac-tura.com", "38.43.130.119", "06/02/2024", "12:07"],
  ["Merino, Cahuna, Wilver Enmanuel", "38.43.130.119", "06/02/2024", "19:20"],
  ["fac-tura.com", "38.43.130.119", "08/02/2024", "13:53"],
  ["fac-tura.com", "38.43.130.119", "09/02/2024", "11:26"],
  ["fac-tura.com", "132.251.3.43", "10/02/2024", "10:53"],
  ["fac-tura.com", "38.43.130.119", "11/02/2024", "10:37"],
  ["fac-tura.com", "38.25.27.103", "12/02/2024", "09:17"],
  ["fac-tura.com", "38.43.130.119", "13/02/2024", "11:46"],
  ["Merino, Cahuna, Wilver Enmanuel", "38.43.130.119", "13/02/2024", "12:00"],
  ["fac-tura.com", "38.43.130.119", "16/02/2024", "15:45"],
  ["fac-tura.com", "38.43.130.119", "17/02/2024", "11:14"],
  ["fac-tura.com", "38.43.130.119", "19/02/2024", "16:39"],
  ["fac-tura.com", "38.43.130.119", "20/02/2024", "11:12"],
  ["fac-tura.com", "38.43.130.119", "21/02/2024", "11:02"],
  ["fac-tura.com", "38.43.130.119", "22/02/2024", "11:39"],
  ["fac-tura.com", "38.43.130.119", "23/02/2024", "18:59"],
  ["fac-tura.com", "38.43.130.119", "24/02/2024", "16:18"],
  ["fac-tura.com", "38.43.130.119", "26/02/2024", "13:11"],
  ["fac-tura.com", "38.43.130.119", "27/02/2024", "14:06"],
  ["fac-tura.com", "38.43.130.119", "01/03/2024", "16:13"],
  ["Merino, Cahuna, Wilver Enmanuel", "38.43.130.119", "01/03/2024", "16:43"],
  ["fac-tura.com", "38.43.130.119", "02/03/2024", "10:26"],
  ["fac-tura.com", "132.184.130.186", "05/03/2024", "10:13"],
  ["fac-tura.com", "38.43.130.119", "07/03/2024", "14:45"],
  ["fac-tura.com", "38.43.130.119", "09/03/2024", "11:14"],
  ["fac-tura.com", "38.43.130.119", "11/03/2024", "11:34"],
].map(([usuario, ip, fecha, horaIngreso]) => ({ usuario, ip, fecha, horaIngreso, refSalida: "", refEntrada: "", horaSalida: "" }));

const dataMerino = [
  ["Romero, Merino, Alexander Renson", "200.121.132.145", "27/12/2023", "18:05"],
  ["Merino, Cahuna, Wilver Enmanuel", "38.43.130.187", "26/01/2024", "18:15"],
  ["Romero, Merino, Alexander Renson", "38.43.130.187", "29/01/2024", "18:02"],
  ["Romero, Merino, Alexander Renson", "170.246.58.51", "30/01/2024", "19:01"],
  ["Merino, Cahuna, Wilver Enmanuel", "170.246.58.51", "30/01/2024", "19:31"],
  ["Merino, Cahuna, Wilver Enmanuel", "38.43.130.119", "06/02/2024", "19:20"],
  ["Merino, Cahuna, Wilver Enmanuel", "38.43.130.119", "13/02/2024", "12:00"],
  ["Merino, Cahuna, Wilver Enmanuel", "38.43.130.119", "01/03/2024", "16:43"],
].map(([usuario, ip, fecha, horaIngreso]) => ({ usuario, ip, fecha, horaIngreso, refSalida: "", refEntrada: "", horaSalida: "" }));

const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const diasSemana = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];
const usuarios = [
  "fac-tura.com",
  "Iturri, Quispe, Smith",
  "Merino, Cahuna, Wilver Enmanuel",
  "Romero, Merino, Alexander Renson",
  "Yupanqui, Barboza, Raysa",
];

const baseRows = dataA;

const styles = {
  page: { minHeight: "100vh", background: "transparent", padding: "22px 20px 28px", fontFamily: "Arial, Helvetica, sans-serif", color: "#111", boxSizing: "border-box" },
  wrapper: { width: "100%", maxWidth: "1460px", margin: "0 auto" },
  titleRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "22px", fontSize: "16px", color: "#111" },
  titleIcon: { width: "14px", height: "14px", borderRadius: "50%", background: "#1d8fe1", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "bold", lineHeight: 1 },
  filtersRow: { display: "grid", gridTemplateColumns: "1.55fr 0.72fr 0.72fr auto", gap: "26px", alignItems: "start" },
  searchBlock: { minWidth: 0 },
  radiosRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", fontSize: "14px", flexWrap: "wrap", color: "#111" },
  buscarX: { fontWeight: 700, color: "#111" },
  radioLabel: { display: "inline-flex", alignItems: "center", gap: "4px", fontWeight: 400, color: "#111" },
  searchInputRow: { display: "flex", alignItems: "center", gap: "4px" },
  input: { width: "100%", height: "46px", border: "1px solid #c9c9c9", background: "#fff", borderRadius: "2px", padding: "0 12px", fontSize: "15px", outline: "none", boxSizing: "border-box", color: "#111", WebkitTextFillColor: "#111" },
  yO: { fontWeight: 700, fontSize: "14px", color: "#111" },
  fieldBlock: { position: "relative", minWidth: 0 },
  fieldLabel: { display: "block", marginBottom: "6px", fontSize: "14px", color: "#111" },
  dateBox: { position: "relative" },
  dateInput: { width: "100%", height: "42px", border: "1px solid #c9c9c9", background: "#fff", borderRadius: "2px", padding: "0 44px 0 12px", fontSize: "15px", outline: "none", boxSizing: "border-box", color: "#111", WebkitTextFillColor: "#111" },
  calendarBtn: { position: "absolute", top: "50%", right: "6px", transform: "translateY(-50%)", width: "32px", height: "32px", border: "1px solid #c9c9c9", borderRadius: "6px", background: "#fff", color: "#2aa1d3", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  buttonsCol: { display: "flex", alignItems: "flex-end", gap: "12px", paddingTop: "22px" },
  searchBtn: { height: "41px", border: "none", borderRadius: "6px", background: "#36a9d5", color: "#fff", padding: "0 16px", display: "flex", alignItems: "center", gap: "8px", fontSize: "15px", cursor: "pointer" },
  plusBtn: { width: "42px", height: "41px", border: "none", borderRadius: "6px", background: "#36a9d5", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "26px", lineHeight: 1 },
  sectionTitle: { textAlign: "center", marginTop: "18px", marginBottom: "8px", fontSize: "17px", color: "#111" },
  tableWrap: { width: "100%", border: "1px solid #d0d0d0", background: "#fff", overflowX: "auto" },
  tableHeader: { display: "grid", gridTemplateColumns: "2.1fr 1.1fr 1fr 0.9fr 1fr 1fr 0.9fr 50px", background: "#045f89", color: "#fff", minWidth: "1100px", textAlign: "center", alignItems: "center", minHeight: "40px", fontSize: "15px", letterSpacing: "0.2px" },
  tableRow: { display: "grid", gridTemplateColumns: "2.1fr 1.1fr 1fr 0.9fr 1fr 1fr 0.9fr 50px", minWidth: "1100px", textAlign: "center", alignItems: "center", minHeight: "44px", borderTop: "1px solid #dedede", fontSize: "14px", color: "#111", background: "#fff" },
  cell: { padding: "12px 8px", boxSizing: "border-box", color: "inherit" },
  thumbCell: { display: "flex", justifyContent: "center", alignItems: "center", color: "#1188e5" },
  calendarPopup: { position: "absolute", top: "66px", left: 0, width: "300px", background: "#fff", border: "1px solid #cfcfcf", boxShadow: "0 6px 14px rgba(0,0,0,0.14)", zIndex: 9999, color: "#111" },
  calTop: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px" },
  calArrow: { border: "none", background: "transparent", color: "#2b85e3", width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", borderRadius: "50%" },
  selectsWrap: { display: "flex", alignItems: "center", gap: "2px" },
  select: { height: "44px", border: "1px solid #d3d3d3", background: "#f5f5f5", fontSize: "16px", color: "#222", padding: "0 14px", outline: "none", borderRadius: "2px", WebkitTextFillColor: "#222" },
  weekRow: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", padding: "0 10px 8px", textAlign: "center", fontSize: "15px", color: "#333" },
  daysGrid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", padding: "0 10px 10px" },
  dayBtn: { height: "30px", border: "1px solid #cfcfcf", background: "#fff", color: "#222", fontSize: "15px", cursor: "pointer", borderRadius: "9px" },
  dayEmpty: { height: "30px", border: "1px solid transparent", background: "transparent" },
  daySelected: { background: "#efe88d" },
  resultInfo: { marginTop: "8px", fontSize: "13px", color: "#555" },
};

function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function parseDate(value) {
  if (!value) return new Date(2026, 2, 13);
  const match = String(value).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return new Date(2026, 2, 13);
  const [, day, month, year] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function CalendarInput({ label, value, onChange, isOpen, onOpen, onClose }) {
  const safeValue = value || "";
  const parsedDate = useMemo(() => parseDate(safeValue), [safeValue]);
  const [viewDate, setViewDate] = useState(parsedDate);

  const yearOptions = useMemo(() => {
    const y = viewDate.getFullYear();
    return Array.from({ length: 9 }, (_, i) => y - 4 + i);
  }, [viewDate]);

  const days = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const first = new Date(year, month, 1);
    const offset = (first.getDay() + 6) % 7;
    const total = new Date(year, month + 1, 0).getDate();
    const items = [];
    for (let i = 0; i < offset; i += 1) items.push(null);
    for (let d = 1; d <= total; d += 1) items.push(d);
    return items;
  }, [viewDate]);

  const selectedDay = safeValue ? parsedDate.getDate() : null;
  const selectedMonth = safeValue ? parsedDate.getMonth() : null;
  const selectedYear = safeValue ? parsedDate.getFullYear() : null;

  const selectDay = (day) => {
    if (!day) return;
    const next = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    onChange(formatDate(next));
    onClose();
  };

  const handleBlur = () => {
    const match = safeValue.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return;
    const [, dd, mm, yyyy] = match;
    const next = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    if (!Number.isNaN(next.getTime())) setViewDate(next);
  };

  return (
    <div style={styles.fieldBlock}>
      <label style={styles.fieldLabel}>{label}</label>
      <div style={styles.dateBox}>
        <input
          type="text"
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          placeholder="dd/mm/aaaa"
          style={styles.dateInput}
        />
        <button
          type="button"
          onClick={() => {
            setViewDate(parsedDate);
            onOpen();
          }}
          style={styles.calendarBtn}
          aria-label={`Abrir calendario de ${label}`}
        >
          <CalendarDays size={20} strokeWidth={2} />
        </button>
      </div>

      {isOpen && (
        <div style={styles.calendarPopup}>
          <div style={styles.calTop}>
            <button type="button" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} style={styles.calArrow}>
              <ChevronLeft size={16} />
            </button>

            <div style={styles.selectsWrap}>
              <select value={viewDate.getMonth()} onChange={(e) => setViewDate(new Date(viewDate.getFullYear(), Number(e.target.value), 1))} style={{ ...styles.select, width: "94px" }}>
                {meses.map((mes, i) => (
                  <option key={mes} value={i}>{mes}</option>
                ))}
              </select>
              <select value={viewDate.getFullYear()} onChange={(e) => setViewDate(new Date(Number(e.target.value), viewDate.getMonth(), 1))} style={{ ...styles.select, width: "86px" }}>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <button type="button" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} style={styles.calArrow}>
              <ChevronRight size={16} />
            </button>
          </div>

          <div style={styles.weekRow}>
            {diasSemana.map((dia) => (
              <div key={dia}>{dia}</div>
            ))}
          </div>

          <div style={styles.daysGrid}>
            {days.map((day, index) => {
              const isSelected = day && selectedDay && day === selectedDay && viewDate.getMonth() === selectedMonth && viewDate.getFullYear() === selectedYear;
              if (!day) return <div key={`empty-${index}`} style={styles.dayEmpty} />;
              return (
                <button
                  key={`${day}-${index}`}
                  type="button"
                  onClick={() => selectDay(day)}
                  style={{ ...styles.dayBtn, ...(isSelected ? styles.daySelected : {}) }}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function getRowsBySearch(value) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return baseRows;
  if (normalized === "a") return dataA;
  if (normalized === "b") return dataB;
  if (normalized === "c") return dataC;
  if (normalized === "merino") return dataMerino;

  const merged = [...dataA, ...dataB, ...dataC, ...dataMerino];
  const unique = merged.filter(
    (row, index, array) =>
      index === array.findIndex(
        (item) => item.usuario === row.usuario && item.ip === row.ip && item.fecha === row.fecha && item.horaIngreso === row.horaIngreso,
      ),
  );

  return unique.filter(
    (row) =>
      row.usuario.toLowerCase().includes(normalized) ||
      row.ip.toLowerCase().includes(normalized) ||
      row.fecha.toLowerCase().includes(normalized),
  );
}

function getSavedRows() {
  try {
    const raw = localStorage.getItem("asistencia_guardada");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function openNuevaAsistenciaTab() {
  const popup = window.open("", "_blank");
  if (!popup) return;

  popup.document.write(`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Asistencia Personal</title>
        <style>
          body {
            font-family: Arial, Helvetica, sans-serif;
            margin: 0;
            background: #ffffff;
            color: #111;
            padding: 14px 18px;
          }
          .title {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 16px;
            margin-bottom: 22px;
          }
          .help {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #1d8fe1;
            color: white;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: bold;
          }
          .grid {
            display: grid;
            grid-template-columns: repeat(6, 1fr) auto;
            gap: 10px;
            align-items: end;
          }
          label {
            display: block;
            margin-bottom: 4px;
            font-weight: 700;
            font-size: 14px;
          }
          input, select {
            width: 100%;
            height: 42px;
            border: 1px solid #c9c9c9;
            border-radius: 3px;
            padding: 0 10px;
            box-sizing: border-box;
            font-size: 14px;
          }
          .btns {
            display: flex;
            gap: 10px;
            padding-bottom: 3px;
          }
          .btn {
            width: 50px;
            height: 47px;
            border: none;
            border-radius: 8px;
            background: #36a9d5;
            color: white;
            font-size: 24px;
            cursor: pointer;
          }
          .btn.small {
            font-size: 20px;
          }
          .msg {
            margin-top: 14px;
            font-size: 14px;
            color: #0b7d28;
          }
        </style>
      </head>
      <body>
        <div class="title"><span class="help">?</span><span>ASISTENCIA PERSONAL</span></div>
        <form id="formAsistencia">
          <div class="grid">
            <div>
              <label>Usuario</label>
              <select name="usuario">
                <option value=""></option>
                ${usuarios.map((u) => `<option value="${u}">${u}</option>`).join("")}
              </select>
            </div>
            <div>
              <label>Fecha</label>
              <input type="text" name="fecha" placeholder="dd/mm/aaaa" />
            </div>
            <div>
              <label>Hora I</label>
              <input type="text" name="horaI" placeholder="hh:mm" />
            </div>
            <div>
              <label>Ref.Salida</label>
              <input type="text" name="refSalida" />
            </div>
            <div>
              <label>Ref.Entrada</label>
              <input type="text" name="refEntrada" />
            </div>
            <div>
              <label>Hora F</label>
              <input type="text" name="horaF" placeholder="hh:mm" />
            </div>
            <div class="btns">
              <button type="submit" class="btn small">💾</button>
              <button type="button" class="btn" onclick="window.close()">↩</button>
            </div>
          </div>
        </form>
        <div id="msg" class="msg"></div>

        <script>
          const form = document.getElementById('formAsistencia');
          const msg = document.getElementById('msg');
          form.addEventListener('submit', function (e) {
            e.preventDefault();
            const fd = new FormData(form);
            const row = {
              usuario: fd.get('usuario') || '',
              ip: '::1',
              fecha: fd.get('fecha') || '',
              horaIngreso: fd.get('horaI') || '',
              refSalida: fd.get('refSalida') || '',
              refEntrada: fd.get('refEntrada') || '',
              horaSalida: fd.get('horaF') || ''
            };
            const list = JSON.parse(localStorage.getItem('asistencia_guardada') || '[]');
            list.unshift(row);
            localStorage.setItem('asistencia_guardada', JSON.stringify(list));
            msg.textContent = 'Asistencia guardada correctamente';
            form.reset();
          });
        <\/script>
      </body>
    </html>
  `);
  popup.document.close();
}

export default function Asistencia() {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [openCalendar, setOpenCalendar] = useState(null);
  const [busqueda, setBusqueda] = useState("usuario");
  const [texto, setTexto] = useState("a");
  const [rows, setRows] = useState([...baseRows, ...getSavedRows()]);
  const [hoverRow, setHoverRow] = useState(null);

  useEffect(() => {
    const syncRows = () => {
      setRows([...getRowsBySearch(texto), ...getSavedRows()]);
    };
    window.addEventListener("storage", syncRows);
    return () => window.removeEventListener("storage", syncRows);
  }, [texto]);

  const handleBuscar = () => {
    setRows([...getRowsBySearch(texto), ...getSavedRows()]);
  };

  return (
    <div style={styles.page} onClick={() => setOpenCalendar(null)}>
      <div style={styles.wrapper} onClick={(e) => e.stopPropagation()}>
        <div style={styles.titleRow}>
          <div style={styles.titleIcon}>?</div>
          <span>ASISTENCIA PERSONAL</span>
        </div>

        <div style={styles.filtersRow}>
          <div style={styles.searchBlock}>
            <div style={styles.radiosRow}>
              <span style={styles.buscarX}>BUSCAR X</span>
              <label style={styles.radioLabel}>
                <input type="radio" name="busqueda" checked={busqueda === "usuario"} onChange={() => setBusqueda("usuario")} />
                <span>Usuario</span>
              </label>
              <span>/</span>
              <label style={styles.radioLabel}>
                <input type="radio" name="busqueda" checked={busqueda === "ruc"} onChange={() => setBusqueda("ruc")} />
                <span>Usuario ruc</span>
              </label>
            </div>

            <div style={styles.searchInputRow}>
              <input type="text" value={texto} onChange={(e) => setTexto(e.target.value)} style={styles.input} placeholder="Escribe a, b, c o Merino" />
              <span style={styles.yO}>y/o</span>
            </div>
            <div style={styles.resultInfo}>Resultados: {rows.length}</div>
          </div>

          <CalendarInput
            label="Fecha Inicio"
            value={fechaInicio}
            onChange={setFechaInicio}
            isOpen={openCalendar === "inicio"}
            onOpen={() => setOpenCalendar("inicio")}
            onClose={() => setOpenCalendar(null)}
          />

          <CalendarInput
            label="Fecha Fin"
            value={fechaFin}
            onChange={setFechaFin}
            isOpen={openCalendar === "fin"}
            onOpen={() => setOpenCalendar("fin")}
            onClose={() => setOpenCalendar(null)}
          />

          <div style={styles.buttonsCol}>
            <button type="button" style={styles.searchBtn} onClick={handleBuscar}>
              <Search size={20} />
              <span>Buscar</span>
            </button>
            <button type="button" style={styles.plusBtn} onClick={openNuevaAsistenciaTab}>
              +
            </button>
          </div>
        </div>

        <div style={styles.sectionTitle}>LISTADO DE ASISTENCIA</div>

        <div style={styles.tableWrap}>
          <div style={styles.tableHeader}>
            <div style={styles.cell}>USUARIO</div>
            <div style={styles.cell}>IP</div>
            <div style={styles.cell}>FECHA</div>
            <div style={styles.cell}>HORA I</div>
            <div style={styles.cell}>REF.SAL.</div>
            <div style={styles.cell}>REF.ENT.</div>
            <div style={styles.cell}>HORA S.</div>
            <div style={styles.cell}></div>
          </div>

          {rows.map((row, index) => (
            <div
              key={`${row.usuario}-${row.ip}-${row.fecha}-${row.horaIngreso}-${index}`}
              style={{ ...styles.tableRow, background: hoverRow === index ? "#eef7ff" : "#fff", cursor: "pointer" }}
              onMouseEnter={() => setHoverRow(index)}
              onMouseLeave={() => setHoverRow(null)}
            >
              <div style={styles.cell}>{row.usuario}</div>
              <div style={styles.cell}>{row.ip}</div>
              <div style={styles.cell}>{row.fecha}</div>
              <div style={styles.cell}>{row.horaIngreso}</div>
              <div style={styles.cell}>{row.refSalida}</div>
              <div style={styles.cell}>{row.refEntrada}</div>
              <div style={styles.cell}>{row.horaSalida}</div>
              <div style={styles.thumbCell} title="Confirmar mi salida">
                <ThumbsUp size={17} fill="currentColor" strokeWidth={1.6} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
